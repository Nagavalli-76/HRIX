import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) return NextResponse.json({ error: "Missing webhook signature." }, { status: 401 });
  try {
    if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }
    const payload = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            currency?: string;
            status?: string;
            error_description?: string;
          };
        };
      };
    };
    const payment = payload.payload?.payment?.entity;
    const eventId = request.headers.get("x-razorpay-event-id")?.trim();
    if (!eventId || eventId.length > 200 || !/^[A-Za-z0-9._:-]+$/.test(eventId) || !payload.event) {
      return NextResponse.json({ error: "Webhook event identifier and type are required." }, { status: 400 });
    }
    if (!["payment.captured", "payment.failed"].includes(payload.event)) {
      return NextResponse.json({ received: true, ignored: true });
    }
    if (!payment?.id || !payment.order_id || typeof payment.amount !== "number" || payment.currency !== "INR") {
      return NextResponse.json({ error: "Invalid payment webhook payload." }, { status: 400 });
    }
    const admin = createAdminClient();
    const { data: order, error: orderError } = await admin.from("payment_orders").select("id, amount_paise").eq("razorpay_order_id", payment.order_id).single();
    if (orderError || !order || order.amount_paise !== payment.amount) {
      return NextResponse.json({ error: "Webhook payment does not match a trusted order." }, { status: 400 });
    }
    if (payload.event === "payment.failed") {
      const { error } = await admin.rpc("mark_razorpay_payment_failed", {
        p_order_id: order.id, p_payment_id: payment.id, p_amount_paise: payment.amount, p_currency: payment.currency,
        p_failure_reason: payment.error_description || "Razorpay reported payment.failed",
      });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await admin.rpc("finalize_razorpay_payment", {
        p_order_id: order.id, p_payment_id: payment.id, p_signature: null,
        p_webhook_signature: signature, p_verification_source: "webhook",
        p_amount_paise: payment.amount, p_currency: payment.currency,
      });
      if (error) throw new Error(error.message);
    }
    const { error: eventError } = await admin.from("payment_webhook_events").insert({
      event_id: eventId, event_type: payload.event, payload,
    });
    if (eventError?.code === "23505") return NextResponse.json({ received: true, duplicate: true });
    if (eventError) throw new Error(eventError.message);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook verification or processing failed." }, { status: 400 });
  }
}
