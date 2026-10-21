import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { creatorPlans } from "@/data/pricing";

export function PricingTiers() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {creatorPlans.map((plan) => (
        <GlassCard
          key={plan.id}
          tone={plan.badge ? "accent" : "default"}
          interactive
          className={cn(
            "flex flex-col",
            plan.badge && "lg:-translate-y-2 shadow-glow-violet",
          )}
        >
          {plan.badge ? (
            <Badge tone="violet" className="mb-4 w-fit">
              {plan.badge}
            </Badge>
          ) : (
            <div className="mb-4 h-[26px]" aria-hidden />
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-label text-muted">{plan.name}</p>
            <Badge tone={plan.badge ? "violet" : "neutral"} className="text-xs">
              {plan.validityDuration}
            </Badge>
          </div>
          <p className="font-display mt-3 text-4xl font-semibold tracking-tight">
            ₹{plan.price}
            <span className="text-lg font-medium text-muted">{plan.billingPeriod}</span>
          </p>
          <p className="mt-1 text-xs font-medium text-violet-soft">{plan.renewalNote}</p>
          <p className="mt-2 text-sm text-muted">{plan.tagline}</p>

          <ul className="mt-6 flex-1 space-y-2.5 text-left">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-soft" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            href={plan.ctaHref}
            size="md"
            variant="secondary"
            className={cn(
              "mt-8 w-full text-center font-medium",
              "whitespace-normal break-words leading-snug px-3 py-3 h-auto min-h-[3rem] text-sm sm:text-base",
              plan.badge && "border-violet/40 hover:border-violet shadow-sm"
            )}
          >
            {plan.ctaLabel}
          </Button>
        </GlassCard>
      ))}
    </div>
  );
}
