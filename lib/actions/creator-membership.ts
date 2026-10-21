"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AllowedCreatorPlanId = "entry" | "profile-audit" | "creator-growth";

export interface SubscribeCreatorMembershipResult {
  success?: boolean;
  error?: string;
  planName?: string;
  renewsOn?: string;
}

/**
 * Server action to activate or renew a creator membership plan.
 * Plans:
 * - 'entry': ₹99/month (30 days validity)
 * - 'profile-audit': ₹499/year (365 days / 12 months validity)
 * - 'creator-growth': ₹999/year (365 days / 12 months validity)
 *
 * Enforces server-side authentication, role verification, and records
 * an official invoice item upon activation.
 */
export async function subscribeCreatorMembership(
  planId: AllowedCreatorPlanId
): Promise<SubscribeCreatorMembershipResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Authentication required to subscribe to a membership." };
    }

    // Verify role is creator or admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "creator" && profile?.role !== "admin") {
      return { error: "Creator membership plans are exclusively for creator accounts." };
    }

    // Security Gate: In production, prevent client direct membership activation without payment confirmation
    const allowDirectActivation =
      process.env.ALLOW_DIRECT_MEMBERSHIP_ACTIVATION === "true" ||
      process.env.NODE_ENV !== "production";

    if (!allowDirectActivation && profile?.role !== "admin") {
      return {
        error: "Direct activation is disabled. Paid memberships require verified payment confirmation.",
      };
    }

    // Verify plan exists in database
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("id, name, price, duration_days, is_active")
      .eq("id", planId)
      .maybeSingle();

    if (planError || !plan) {
      return { error: "Selected membership plan could not be found." };
    }

    if (!plan.is_active) {
      return { error: "This membership plan is currently inactive." };
    }

    // Calculate exact expiration (365 days for annual plans, 30 days for monthly)
    const durationDays = plan.duration_days ?? (planId === "entry" ? 30 : 365);
    const renewsOn = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    // Upsert user subscription
    const { error: subError } = await supabase
      .from("user_subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan_id: plan.id,
          status: "active",
          renews_on: renewsOn,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,plan_id" }
      );

    if (subError) {
      // Fallback standard insert if onConflict fails
      const { error: insertError } = await supabase.from("user_subscriptions").insert({
        user_id: user.id,
        plan_id: plan.id,
        status: "active",
        renews_on: renewsOn,
      });

      if (insertError) {
        console.error("Error creating creator subscription:", insertError);
        return { error: "Unable to activate membership. Please try again." };
      }
    }

    // Create invoice record
    const periodDescription =
      durationDays >= 365
        ? "Annual Subscription (12 Months Validity)"
        : "Monthly Membership (30 Days Validity)";

    await supabase.from("invoices").insert({
      user_id: user.id,
      description: `${plan.name} — ${periodDescription}`,
      amount_inr: plan.price,
      status: "paid",
      issued_on: new Date().toISOString().split("T")[0],
    });

    revalidatePath("/creator/dashboard");
    revalidatePath("/creator/dashboard/subscription");
    revalidatePath("/pricing");

    return {
      success: true,
      planName: plan.name,
      renewsOn,
    };
  } catch (err: any) {
    console.error("subscribeCreatorMembership error:", err);
    return { error: err.message || "Failed to activate creator membership." };
  }
}

/**
 * Server action to cancel an active creator membership.
 */
export async function cancelCreatorMembership(): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Authentication required." };
    }

    const { error } = await supabase
      .from("user_subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("status", "active");

    if (error) {
      console.error("Error canceling subscription:", error);
      return { error: "Unable to cancel subscription." };
    }

    revalidatePath("/creator/dashboard/subscription");
    return { success: true };
  } catch (err: any) {
    console.error("cancelCreatorMembership error:", err);
    return { error: err.message || "Unable to cancel subscription." };
  }
}
