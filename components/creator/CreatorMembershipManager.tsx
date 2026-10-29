"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, AlertCircle, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatInr } from "@/lib/format";
import { creatorPlans, type CreatorPlan } from "@/data/pricing";
import { cancelCreatorMembership } from "@/lib/actions/creator-membership";
import type { Subscription } from "@/types";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";

interface Props {
  initialSubscription: Subscription;
}

const STATUS_TONE = {
  active: "success",
  "past-due": "warning",
  canceled: "neutral",
  none: "neutral",
} as const;

const STATUS_LABEL = {
  active: "Active",
  "past-due": "Expired",
  canceled: "Canceled",
  none: "Not subscribed",
} as const;

export function CreatorMembershipManager({ initialSubscription }: Props) {
  const router = useRouter();
  const [canceling, setCanceling] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isCurrentPlanActive = initialSubscription.status === "active" && !initialSubscription.isExpired;

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel your creator membership?")) return;
    setCanceling(true);
    setMessage(null);

    try {
      const res = await cancelCreatorMembership();
      if (res?.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Your membership has been canceled." });
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to cancel membership." });
    } finally {
      setCanceling(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Status banner/feedback */}
      {message && (
        <div
          role="alert"
          className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Current Membership Overview Card */}
      <GlassCard tone="raised" className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-ink">{initialSubscription.planName}</h2>
              <Badge tone={STATUS_TONE[initialSubscription.status]}>
                {STATUS_LABEL[initialSubscription.status]}
              </Badge>
              {initialSubscription.billingPeriod && (
                <span className="text-xs font-medium text-faint">
                  Billed {initialSubscription.billingPeriod === "/year" ? "Annually" : "Monthly"}
                </span>
              )}
            </div>

            <div className="mt-2 text-sm text-muted">
              {initialSubscription.status === "none" ? (
                <p>No active creator membership. Select an annual plan or monthly entry below to activate your benefits.</p>
              ) : initialSubscription.isExpired ? (
                <p className="text-amber-400">
                  Expired on{" "}
                  {initialSubscription.renewsOn ? formatDate(initialSubscription.renewsOn) : "the end of your billing cycle"}
                  . Renew below to restore your full creator service benefits.
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    Price: {formatInr(initialSubscription.priceInr)}
                    {initialSubscription.billingPeriod || "/month"}
                  </span>
                  {initialSubscription.renewsOn && (
                    <span className="inline-flex items-center gap-1.5 text-violet-soft">
                      <Calendar className="h-4 w-4" aria-hidden />
                      Renews on {formatDate(initialSubscription.renewsOn)} (Valid for{" "}
                      {initialSubscription.billingPeriod === "/year" ? "12 months" : "30 days"})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {isCurrentPlanActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={canceling}
              className="text-faint hover:text-red-400"
            >
              {canceling ? "Canceling..." : "Cancel subscription"}
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Available Plans Selector */}
      <div>
        <div className="mb-4">
          <h2 className="text-title">Creator Membership & Service Plans</h2>
          <p className="text-sm text-muted">
            Choose an annual subscription for comprehensive review and roadmap guidance, or start with monthly entry.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {creatorPlans.map((plan) => {
            const isSelected =
              isCurrentPlanActive &&
              (initialSubscription.planId === plan.id ||
                initialSubscription.planName.toLowerCase() === plan.name.toLowerCase());
            const isAnnual = plan.billingPeriod === "/year";

            return (
              <GlassCard
                key={plan.id}
                tone={isSelected ? "accent" : plan.badge ? "raised" : "default"}
                className={`flex flex-col justify-between p-6 ${
                  isSelected ? "border-violet/60 shadow-glow-violet" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink">{plan.name}</p>
                    {plan.badge ? (
                      <Badge tone="violet" className="text-xs">
                        {plan.badge}
                      </Badge>
                    ) : (
                      <Badge tone="neutral" className="text-xs">
                        {plan.validityDuration}
                      </Badge>
                    )}
                  </div>

                  <p className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">
                    ₹{plan.price.toLocaleString("en-IN")}
                    <span className="text-base font-medium text-muted">{plan.billingPeriod}</span>
                  </p>

                  <p className="mt-1 text-xs font-medium text-violet-soft">{plan.renewalNote}</p>
                  <p className="mt-2 text-xs text-muted">{plan.tagline}</p>

                  <ul className="mt-5 space-y-2 border-t border-line/60 pt-4 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-muted">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-soft" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-2">
                  <RazorpayCheckoutButton
                    planId={plan.id}
                    label={isSelected ? "Renew securely" : isAnnual ? `Subscribe Annual (₹${plan.price}/year)` : `Subscribe Entry (₹${plan.price}/mo)`}
                    onComplete={() => router.refresh()}
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Clear Disclosure Notice */}
        <p className="mt-6 text-center text-xs text-faint">
          All annual plans (Profile Audit ₹499/year and Creator Growth ₹999/year) are valid for 12 continuous months
          from the time of subscription. Membership renewal date and active status are always displayed in this
          dashboard. Renewals are manual upon expiration with explicit user consent; automated recurring card charges
          and lifetime access are not implemented.
        </p>
      </div>
    </div>
  );
}
