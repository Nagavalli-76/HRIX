import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRazorpayClient, getRazorpayKeyId } from "@/lib/payments/razorpay";
import { isAuthorizedAdminRecord } from "@/lib/api/auth";

const CREATOR_PLANS = new Set(["entry", "profile-audit", "creator-growth"]);
const BRAND_PLANS = new Set(["brand-directory-access"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const planId = typeof body?.planId === "string" ? body.planId : "";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
    const isAdmin = isAuthorizedAdminRecord(profile?.role, user.email);
    const allowed = profile?.role === "creator" ? CREATOR_PLANS.has(planId) : profile?.role === "brand" ? BRAND_PLANS.has(planId) : isAdmin;
    if (!allowed) return NextResponse.json({ error: "Plan is not available for this account." }, { status: 403 });

    if (profile?.role === "brand" && planId === "brand-directory-access") {
      const { data: brand } = await admin.from("brand_profiles").select("trust, status").eq("user_id", user.id).single();
      if (brand?.trust !== "verified-brand" || brand.status !== "active") {
        return NextResponse.json({ error: "Brand verification is required before payment." }, { status: 403 });
      }
    }

    const { data: plan } = await admin.from("subscription_plans").select("id, name, price, is_active").eq("id", planId).single();
    const amountPaise = plan?.price == null ? 0 : Math.round(Number(plan.price) * 100);
    if (!plan?.is_active || !Number.isSafeInteger(amountPaise) || amountPaise < 100) {
      return NextResponse.json({ error: "Selected plan is unavailable." }, { status: 400 });
    }

    const order = await getRazorpayClient().orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `hrix_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: { user_id: user.id, plan_id: plan.id },
    });
    const { error } = await admin.from("payment_orders").insert({
      user_id: user.id, plan_id: plan.id, razorpay_order_id: order.id,
      amount_paise: order.amount, currency: order.currency, status: "created",
    });
    if (error) throw new Error(`Unable to persist payment order: ${error.message}`);
    return NextResponse.json({ keyId: getRazorpayKeyId(), orderId: order.id, amount: order.amount, currency: order.currency, planName: plan.name });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create payment order." }, { status: 500 });
  }
}
