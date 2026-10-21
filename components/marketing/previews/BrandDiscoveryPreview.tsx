import { Filter, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";

/**
 * Illustrative mockup of the creator discovery/filter UI for the "Why
 * brands join" section. Intentionally not sourced from live creator data —
 * this shows the filtering layout, not real HRIX creators.
 */
export function BrandDiscoveryPreview() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-faint" aria-hidden />
        <Badge tone="violet">Category</Badge>
        <Badge>Location</Badge>
        <Badge>Platform</Badge>
        <Badge>Audience size</Badge>
      </div>

      <GlassCard tone="raised" className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-violet/30 bg-violet/10 text-violet-soft">
          <Users className="h-5 w-5" aria-hidden />
        </div>
        <p className="mt-3 font-medium text-ink">Creator discovery</p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
          Verified brand accounts can filter and browse creator profiles by
          category, location, platform and audience size.
        </p>
      </GlassCard>
    </div>
  );
}
