import { Lock, ShieldAlert, ShieldCheck, Sparkles, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { brandPlans } from "@/data/pricing";
import { BrandAccessSubscribeButton } from "@/components/brand/BrandAccessSubscribeButton";
import type { BrandAccessStatus } from "@/lib/api/brand-access";

export function LockedCreatorDirectory({
  status,
  isDashboard = false,
}: {
  status: BrandAccessStatus;
  isDashboard?: boolean;
}) {
  const brandPlan = brandPlans[0];

  // 1. Unauthenticated Visitor
  if (status.reason === "unauthenticated") {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center md:py-16">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-violet/30 bg-violet/10 text-violet-soft">
          <Lock className="h-6 w-6" aria-hidden />
        </div>

        <Badge tone="violet" className="mt-6">
          Verified Brand Access Only
        </Badge>

        <h1 className="text-display mt-4">Discover Creators on HRIX</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Explore verified creator profiles and find the right partners for your brand campaigns.
        </p>

        <GlassCard tone="accent" className="mx-auto mt-8 max-w-lg p-6 text-left">
          <p className="text-sm font-medium text-ink">
            Creator discovery is available exclusively to eligible HRIX brands.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 text-violet-soft shrink-0" />
              <span>Browse registered creators across Lifestyle, Tech, Fitness & more</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 text-violet-soft shrink-0" />
              <span>Inspect verified platform engagement & audience statistics</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 text-violet-soft shrink-0" />
              <span>Connect directly with creators for paid campaigns & partnerships</span>
            </li>
          </ul>
        </GlassCard>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button href="/register?role=brand" size="lg">
            Join HRIX as a Brand
          </Button>
          <Button href="/login?redirect=/creators" variant="secondary" size="lg">
            Log in as a Brand
          </Button>
        </div>
      </div>
    );
  }

  // 2. Logged-in Creator
  if (status.reason === "creator_role") {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center md:py-16">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-violet/30 bg-violet/10 text-violet-soft">
          <Sparkles className="h-6 w-6" aria-hidden />
        </div>

        <Badge tone="neutral" className="mt-6">
          Creator Account
        </Badge>

        <h1 className="text-headline mt-4">Creator Discovery is for Brands</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          As a registered creator on HRIX, your profile is showcased to verified partner brands looking for collaborators.
        </p>

        <GlassCard tone="default" className="mx-auto mt-8 max-w-md p-6">
          <p className="text-sm text-muted">
            Creator discovery is available exclusively to eligible HRIX brands. You can manage your profile, review applications, and collaborate with brands from your dashboard.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/creator/dashboard" size="md">
              Go to Creator Dashboard
            </Button>
            <Button href="/creator/dashboard/profile" variant="secondary" size="md">
              View & Edit My Profile
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // 3. Brand Pending Verification
  if (status.reason === "verification_pending") {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center md:py-16">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
          <ShieldAlert className="h-6 w-6" aria-hidden />
        </div>

        <Badge tone="warning" className="mt-6">
          Verification Pending
        </Badge>

        <h1 className="text-headline mt-4">Brand Verification Under Review</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Your brand account ({status.brand?.name ?? "Brand"}) is currently undergoing verification.
        </p>

        <GlassCard tone="raised" className="mx-auto mt-8 max-w-md p-6 text-left">
          <p className="text-sm font-medium text-ink">Verification required for creator discovery</p>
          <p className="mt-2 text-sm text-muted">
            To protect our creator network, only verified brands with an active access subscription can browse creator profiles.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/brand/dashboard/profile" variant="secondary" size="md">
              Check Verification Status
            </Button>
            <Button href="/brand/dashboard" variant="ghost" size="md">
              Return to Brand Dashboard
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // 4. Brand Verification Action Required or Rejected
  if (status.reason === "verification_rejected" || status.reason === "brand_profile_missing") {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center md:py-16">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
          <ShieldAlert className="h-6 w-6" aria-hidden />
        </div>

        <Badge tone="danger" className="mt-6">
          Verification Required
        </Badge>

        <h1 className="text-headline mt-4">Brand Verification Required</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Please complete your brand profile and verification documents to unlock access to registered creators.
        </p>

        <div className="mt-8 flex justify-center">
          <Button href="/brand/dashboard/profile" size="lg">
            Complete Brand Verification
          </Button>
        </div>
      </div>
    );
  }

  // 5. Verified Brand Without Active Subscription or Expired
  const isExpired = status.reason === "subscription_expired";

  return (
    <div className="mx-auto max-w-2xl py-12 text-center md:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-violet/30 bg-violet/10 text-violet-soft">
        <ShieldCheck className="h-6 w-6" aria-hidden />
      </div>

      <Badge tone="violet" className="mt-6">
        {isExpired ? "Subscription Expired" : "Verified Brand"}
      </Badge>

      <h1 className="text-headline mt-4">
        {isExpired ? "Renew Brand Directory Access" : "Unlock Creator Discovery"}
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-muted">
        {isExpired
          ? "Your Brand Directory Access plan has expired. Renew your subscription to continue browsing creators."
          : `Congratulations! Your brand (${status.brand?.name}) is verified. Activate Brand Directory Access to start discovering creators.`}
      </p>

      {brandPlan && (
        <GlassCard tone="accent" className="mx-auto mt-8 max-w-md p-6 text-left">
          <div className="flex items-baseline justify-between">
            <h2 className="text-title">{brandPlan.name}</h2>
            <Badge tone="violet">{brandPlan.badge}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted">{brandPlan.tagline}</p>

          <p className="font-display mt-4 text-3xl font-semibold tracking-tight text-ink">
            ₹{brandPlan.price.toLocaleString("en-IN")}
            <span className="text-base font-medium text-muted">{brandPlan.billingPeriod}</span>
          </p>
          <p className="mt-0.5 text-xs font-medium text-violet-soft">{brandPlan.renewalNote}</p>

          <ul className="mt-6 space-y-2.5 text-sm text-muted">
            {brandPlan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 text-violet-soft shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-2">
            <BrandAccessSubscribeButton
              planId={brandPlan.id}
              label={isExpired ? "Renew Brand Access (₹2,999/month)" : "Activate Brand Access (₹2,999/month)"}
            />
          </div>
        </GlassCard>
      )}
    </div>
  );
}
