import type { Invoice, Subscription } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function getSubscription(): Promise<Subscription> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { status: "none", planName: "HRIX Entry", priceInr: 99 };

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("plan_id, status, renews_on, subscription_plans(id, name, price, duration_days, type)")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Unable to load subscription: ${error.message}`);
  if (!data) return { status: "none", planName: "HRIX Entry", priceInr: 99 };

  const plan = (data as any).subscription_plans;
  const planName = plan?.name || "HRIX Entry";
  const durationDays = plan?.duration_days ?? 30;
  const isAnnual = durationDays >= 365;

  let status = data.status;
  let isExpired = false;

  // Enforce annual and monthly validity: expired memberships lose active status
  if (data.renews_on) {
    const expiresAt = new Date(data.renews_on).getTime();
    if (expiresAt < Date.now()) {
      isExpired = true;
      if (status === "active") {
        status = "past-due";
      }
    }
  } else if (status === "active") {
    // If active without an expiration timestamp, flag as requiring renewal (no lifetime access)
    isExpired = true;
    status = "past-due";
  }

  return {
    status,
    planId: data.plan_id,
    planName,
    priceInr: Number(plan?.price ?? 99),
    renewsOn: data.renews_on ?? undefined,
    isExpired,
    durationDays,
    billingPeriod: isAnnual ? "/year" : "/month",
  };
}

export async function listInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("invoices")
    .select("id, description, amount_inr, issued_on, status")
    .eq("user_id", userData.user.id)
    .order("issued_on", { ascending: false });
  if (error) throw new Error(`Unable to load invoices: ${error.message}`);
  return (data ?? []).map((invoice) => ({
    id: invoice.id,
    description: invoice.description,
    amountInr: Number(invoice.amount_inr),
    issuedOn: invoice.issued_on,
    status: invoice.status,
  }));
}

export async function listAllInvoicesForAdmin(): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Authentication required");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();
  if (profileError || profile?.role !== "admin") throw new Error("Admin authorization required");

  const { data, error } = await supabase
    .from("invoices")
    .select("id, description, amount_inr, issued_on, status")
    .order("issued_on", { ascending: false });
  if (error) throw new Error(`Unable to load payment activity: ${error.message}`);
  return (data ?? []).map((invoice) => ({
    id: invoice.id,
    description: invoice.description,
    amountInr: Number(invoice.amount_inr),
    issuedOn: invoice.issued_on,
    status: invoice.status,
  }));
}
