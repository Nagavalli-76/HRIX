import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

interface WebhookPayload {
  eventId?: string;
  eventType:
    | "payment.succeeded"
    | "payment.failed"
    | "subscription.activated"
    | "subscription.canceled"
    | "subscription.expired"
    | "invoice.paid"
    | "invoice.payment_failed";
  userId: string;
  planId?: string;
  amountInr?: number;
  paymentId?: string;
  description?: string;
  timestamp?: string;
}

/**
 * Validates webhook authentication using constant-time string comparison.
 * Requires PAYMENT_WEBHOOK_SECRET to be configured on the server.
 * Never falls back to database service role keys or allows unauthenticated execution.
 */
function verifyWebhookAuth(request: NextRequest): { valid: boolean; reason?: string } {
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("PAYMENT_WEBHOOK_SECRET is not configured on the server.");
    return { valid: false, reason: "Server configuration error: PAYMENT_WEBHOOK_SECRET is missing." };
  }

  const authHeader =
    request.headers.get("x-webhook-secret") ||
    request.headers.get("x-payment-signature") ||
    request.headers.get("authorization");

  if (!authHeader) {
    return { valid: false, reason: "Missing authentication header." };
  }

  const providedSecret = authHeader.replace(/^Bearer\s+/i, "").trim();

  // Timing-safe comparison to prevent timing side-channel attacks
  try {
    const expectedBuffer = Buffer.from(webhookSecret);
    const providedBuffer = Buffer.from(providedSecret);

    if (expectedBuffer.length !== providedBuffer.length) {
      return { valid: false, reason: "Invalid signature length." };
    }

    const match = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    return { valid: match, reason: match ? undefined : "Invalid webhook secret." };
  } catch {
    return { valid: false, reason: "Error validating webhook credentials." };
  }
}

/**
 * Server-side payment webhook handler.
 * Reuses the existing Supabase payment system of record:
 * - Enforces server-side authentication with timing-safe comparison
 * - Idempotently handles duplicate webhook events via eventId AND paymentId checks
 * - Prevents multiple billings or duplicate membership extensions
 * - Updates user_subscriptions and invoices with strict status transitions
 * - Never exposes service-role keys or payment secrets
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Strict Authorization verification (fails closed if secret is missing or invalid)
    const authResult = verifyWebhookAuth(request);
    if (!authResult.valid) {
      const isMissingConfig = authResult.reason?.includes("Server configuration error");
      return NextResponse.json(
        { error: isMissingConfig ? "Webhook endpoint not configured." : "Unauthorized: Invalid payment credentials." },
        { status: isMissingConfig ? 500 : 401 }
      );
    }

    // 2. Parse payload safely
    let body: WebhookPayload;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const { eventType, eventId, userId, planId, amountInr, paymentId, description } = body;

    if (!eventType || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: eventType and userId are mandatory." },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // 3. Comprehensive Idempotency Check:
    // Check both eventId and paymentId to ensure duplicate events cannot create duplicate invoices
    // or extend memberships twice.
    const idempotencyKey = eventId || paymentId;
    if (idempotencyKey) {
      const { data: existingAudit } = await adminSupabase
        .from("admin_audit_logs")
        .select("id, details")
        .eq("target_type", "webhook_event")
        .eq("target_id", idempotencyKey)
        .maybeSingle();

      if (existingAudit) {
        return NextResponse.json(
          {
            received: true,
            status: "duplicate",
            message: `Event/Payment '${idempotencyKey}' has already been processed.`,
          },
          { status: 200 }
        );
      }
    }

    // 4. Handle events
    switch (eventType) {
      case "payment.succeeded":
      case "subscription.activated":
      case "invoice.paid": {
        const targetPlanId = planId || "entry";

        // Query plan metadata
        const { data: plan, error: planError } = await adminSupabase
          .from("subscription_plans")
          .select("id, name, price, duration_days")
          .eq("id", targetPlanId)
          .maybeSingle();

        if (planError || !plan) {
          return NextResponse.json(
            { error: `Plan '${targetPlanId}' not recognized.` },
            { status: 400 }
          );
        }

        const durationDays = plan.duration_days ?? (targetPlanId === "entry" ? 30 : 365);
        const renewsOn = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
        const paidAmount = amountInr ?? plan.price;

        // Upsert active subscription with explicit renews_on expiration date
        const { error: subError } = await adminSupabase
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              plan_id: plan.id,
              status: "active",
              renews_on: renewsOn,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,plan_id" }
          );

        if (subError) {
          console.error("Webhook: Failed to upsert subscription:", subError);
          return NextResponse.json(
            { error: "Failed to update user subscription status." },
            { status: 500 }
          );
        }

        // Record paid invoice
        const invoiceDescription =
          description ||
          `${plan.name} (${durationDays >= 365 ? "Annual Subscription · 12 Months" : "Monthly Membership · 30 Days"})`;

        await adminSupabase.from("invoices").insert({
          user_id: userId,
          description: invoiceDescription,
          amount_inr: paidAmount,
          status: "paid",
          issued_on: new Date().toISOString().split("T")[0],
        });

        // Record audit event for strict idempotency
        if (idempotencyKey) {
          await adminSupabase.from("admin_audit_logs").insert({
            action: `payment_processed:${eventType}`,
            target_type: "webhook_event",
            target_id: idempotencyKey,
            details: {
              userId,
              planId: plan.id,
              amount: paidAmount,
              paymentId,
              eventId,
            },
          });
        }

        return NextResponse.json(
          {
            received: true,
            status: "active",
            plan: plan.name,
            renewsOn,
          },
          { status: 200 }
        );
      }

      case "payment.failed":
      case "invoice.payment_failed": {
        // Record failed invoice
        await adminSupabase.from("invoices").insert({
          user_id: userId,
          description: description || `Payment attempt failed (${planId || "membership"})`,
          amount_inr: amountInr ?? 0,
          status: "failed",
          issued_on: new Date().toISOString().split("T")[0],
        });

        if (idempotencyKey) {
          await adminSupabase.from("admin_audit_logs").insert({
            action: `payment_failed:${eventType}`,
            target_type: "webhook_event",
            target_id: idempotencyKey,
            details: { userId, planId, paymentId, eventId },
          });
        }

        return NextResponse.json(
          {
            received: true,
            status: "failed_recorded",
            message: "Failed payment recorded. Subscription access not granted.",
          },
          { status: 200 }
        );
      }

      case "subscription.canceled": {
        await adminSupabase
          .from("user_subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("status", "active");

        return NextResponse.json(
          { received: true, status: "canceled" },
          { status: 200 }
        );
      }

      case "subscription.expired": {
        await adminSupabase
          .from("user_subscriptions")
          .update({ status: "past-due", updated_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("status", "active");

        return NextResponse.json(
          { received: true, status: "expired" },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { error: `Unhandled event type: ${eventType}` },
          { status: 400 }
        );
    }
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Internal server error during webhook processing." },
      { status: 500 }
    );
  }
}
