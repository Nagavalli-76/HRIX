import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body ?? {};
    if (![orderId, paymentId, signature].every((value) => typeof value === "string" && value.length > 0)) {
      return NextResponse.json({ error: "Incomplete Razorpay payment response." }, { status: 400 });
    }
    if (!verifyRazorpaySignature(orderId, paymentId, signature)) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const admin = createAdminClient();
    const { data: order, error: orderError } = await admin.from("payment_orders").select("id, user_id, amount_paise, currency").eq("razorpay_order_id", orderId).single();
    if (orderError || !order || order.user_id !== user.id) {
      return NextResponse.json({ error: "Payment order is invalid or already processed." }, { status: 400 });
    }
    const { data, error } = await admin.rpc("finalize_razorpay_payment", {
      p_order_id: order.id,
      p_payment_id: paymentId,
      p_signature: signature,
      p_webhook_signature: null,
      p_verification_source: "checkout",
      p_amount_paise: order.amount_paise,
      p_currency: order.currency,
    });
    if (error) throw new Error(error.message);
    const result = Array.isArray(data) ? data[0] : data;
    return NextResponse.json({ success: true, planName: result.plan_name, renewsOn: result.renews_on, alreadyFinalized: result.already_finalized });
  } catch (error) {
    console.error("Razorpay payment verification failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to verify payment." }, { status: 500 });
  }
}
