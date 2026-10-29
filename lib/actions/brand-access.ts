"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAuthorizedAdminRecord } from "@/lib/api/auth";

export async function subscribeBrandAccess(planId: string = "brand-directory-access") {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Authentication required to subscribe." };
    }

    // Verify role is brand or admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAuthorizedAdmin = isAuthorizedAdminRecord(profile?.role, user.email);
    if (profile?.role !== "brand" && !isAuthorizedAdmin) {
      return { error: "Brand directory access is exclusively for brand accounts." };
    }

    if (!isAuthorizedAdmin) {
      return {
        error: "Paid brand access requires verified Razorpay payment confirmation.",
      };
    }

    // Check brand verification
    if (profile?.role === "brand") {
      const { data: brandProfile } = await supabase
        .from("brand_profiles")
        .select("trust")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!brandProfile || brandProfile.trust !== "verified-brand") {
        return {
          error: "Brand verification is required before activating directory access.",
        };
      }
    }

    // Check plan exists
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("id, name, price, duration_days")
      .eq("id", planId)
      .maybeSingle();

    if (planError || !plan) {
      return { error: "Selected subscription plan not found." };
    }

    const durationDays = plan.duration_days ?? 30;
    const renewsOn = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    // Upsert user subscription
    const { error: subError } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: user.id,
        plan_id: plan.id,
        status: "active",
        renews_on: renewsOn,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,plan_id" });

    // If onConflict failed or user has an existing one: insert
    if (subError) {
      // try standard insert
      const { error: insertError } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          status: "active",
          renews_on: renewsOn,
        });

      if (insertError) {
        console.error("Error creating subscription:", insertError);
        return { error: "Unable to activate subscription. Please try again." };
      }
    }

    // Create invoice record
    await supabase.from("invoices").insert({
      user_id: user.id,
      description: `${plan.name} (${durationDays} Days)`,
      amount_inr: plan.price,
      status: "paid",
      issued_on: new Date().toISOString().split("T")[0],
    });

    revalidatePath("/creators");
    revalidatePath("/brand/dashboard/creators");
    revalidatePath("/brand/dashboard/shortlisted");
    revalidatePath("/brand/dashboard/payments");

    return { success: true };
  } catch (err: any) {
    console.error("subscribeBrandAccess error:", err);
    return { error: err.message || "Unable to activate subscription." };
  }
}
