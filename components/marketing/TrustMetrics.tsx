import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const PILLARS = [
  {
    icon: Sparkles,
    title: "Built around better creator-brand relationships",
    body: "HRIX is designed as a structured way for creators and brands to find each other, not a numbers game — no follower thresholds, no bidding wars.",
  },
  {
    icon: Users,
    title: "Profile-first, not popularity-first",
    body: "Every creator gets a professional profile and, if they choose, a personal audit and growth roadmap — regardless of current audience size.",
  },
  {
    icon: ShieldCheck,
    title: "No fabricated numbers",
    body: "We won't show you inflated creator counts or engagement stats. What you see on HRIX reflects the platform as it actually is today.",
  },
];

export function TrustMetrics() {
  return (
    <section aria-labelledby="metrics-heading" className="border-t border-line/70">
      <div className="container-page py-16 md:py-20">
        <h2 id="metrics-heading" className="text-headline max-w-xl">
          Built for creators and brands, not vanity metrics
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <GlassCard key={pillar.title}>
              <pillar.icon className="h-6 w-6 text-violet-soft" aria-hidden />
              <div className="mt-4 font-medium text-ink">{pillar.title}</div>
              <p className="mt-2 text-sm text-muted">{pillar.body}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
