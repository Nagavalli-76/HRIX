import { createClient } from "@/lib/supabase/server";

export type BrandAccessDenialReason =
  | "unauthenticated"
  | "creator_role"
  | "brand_profile_missing"
  | "verification_pending"
  | "verification_rejected"
  | "no_subscription"
  | "subscription_expired";

export interface BrandAccessStatus {
  allowed: boolean;
  reason?: BrandAccessDenialReason;
  role?: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
    trust: string;
  };
  subscription?: {
    planId: string;
    renewsOn?: string;
  };
}

/**
 * Server-side source of truth for brand directory access.
 * Creator discovery is available ONLY to authenticated brands with:
 * 1. Role = 'brand' (or 'admin' which has universal access)
 * 2. Brand verification trust state = 'verified-brand'
 * 3. An active, unexpired subscription to a brand-access plan ('brand-directory-access')
 */
export async function getBrandDirectoryAccessStatus(): Promise<BrandAccessStatus> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { allowed: false, reason: "unauthenticated" };
    }

    // 1. Check profile role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, status")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      return { allowed: true, role: "admin" };
    }

    if (profile?.role !== "brand") {
      return { allowed: false, reason: "creator_role", role: profile?.role ?? "creator" };
    }

    // 2. Check brand profile & verification status
    const { data: brandProfile } = await supabase
      .from("brand_profiles")
      .select("id, brand_name, slug, trust, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!brandProfile) {
      return { allowed: false, reason: "brand_profile_missing", role: "brand" };
    }

    const brandData = {
      id: brandProfile.id,
      name: brandProfile.brand_name,
      slug: brandProfile.slug,
      trust: brandProfile.trust,
    };

    if (brandProfile.trust !== "verified-brand") {
      if (brandProfile.trust === "verification-pending") {
        return { allowed: false, reason: "verification_pending", role: "brand", brand: brandData };
      }
      return { allowed: false, reason: "verification_rejected", role: "brand", brand: brandData };
    }

    // 3. Check brand paid subscription entitlement
    const { data: subs, error: subError } = await supabase
      .from("user_subscriptions")
      .select("id, plan_id, status, renews_on, subscription_plans!inner(id, type, is_active)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (subError || !subs || subs.length === 0) {
      return { allowed: false, reason: "no_subscription", role: "brand", brand: brandData };
    }

    // Find any active brand-access plan
    const activeBrandSub = subs.find((sub: any) => {
      const plan = sub.subscription_plans;
      return (
        plan &&
        plan.is_active &&
        (plan.type === "brand-access" || sub.plan_id === "brand-directory-access")
      );
    });

    if (!activeBrandSub) {
      return { allowed: false, reason: "no_subscription", role: "brand", brand: brandData };
    }

    // Check if subscription has expired or missing expiration timestamp (lifetime access is not permitted)
    if (!activeBrandSub.renews_on) {
      return {
        allowed: false,
        reason: "subscription_expired",
        role: "brand",
        brand: brandData,
        subscription: {
          planId: activeBrandSub.plan_id,
        },
      };
    }

    const renewsOnTime = new Date(activeBrandSub.renews_on).getTime();
    if (renewsOnTime < Date.now()) {
      return {
        allowed: false,
        reason: "subscription_expired",
        role: "brand",
        brand: brandData,
        subscription: {
          planId: activeBrandSub.plan_id,
          renewsOn: activeBrandSub.renews_on,
        },
      };
    }

    return {
      allowed: true,
      role: "brand",
      brand: brandData,
      subscription: {
        planId: activeBrandSub.plan_id,
        renewsOn: activeBrandSub.renews_on ?? undefined,
      },
    };
  } catch (err) {
    console.error("Error evaluating brand directory access status:", err);
    return { allowed: false, reason: "unauthenticated" };
  }
}
