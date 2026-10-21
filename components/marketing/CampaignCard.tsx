import Link from "next/link";
import { CalendarClock, MapPin, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatInr } from "@/lib/format";
import type { Campaign } from "@/types";

const STATUS_LABEL: Record<Campaign["status"], string> = {
  open: "Open",
  "closing-soon": "Closing soon",
  closed: "Closed",
};

const STATUS_TONE: Record<Campaign["status"], "success" | "warning" | "neutral"> = {
  open: "success",
  "closing-soon": "warning",
  closed: "neutral",
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <GlassCard as="article" interactive className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-faint">{campaign.brandName}</p>
          <h3 className="font-medium leading-snug text-ink">{campaign.title}</h3>
        </div>
        <TrustBadge state={campaign.trust} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-faint" aria-hidden />
          {campaign.city}
        </span>
        <Badge>{campaign.category}</Badge>
      </div>

      <p className="text-sm text-muted">{campaign.summary}</p>

      <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
        <div>
          <dt className="text-faint">Budget</dt>
          <dd className="font-medium text-ink">{formatInr(campaign.budgetInr, true)}</dd>
        </div>
        <div>
          <dt className="text-faint">Deadline</dt>
          <dd className="inline-flex items-center gap-1.5 font-medium text-ink">
            <CalendarClock className="h-3.5 w-3.5 text-faint" aria-hidden />
            {formatDate(campaign.deadline)}
          </dd>
        </div>
      </dl>

      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-faint">
          <Users className="h-3.5 w-3.5" aria-hidden />
          {campaign.applicants} applicants
        </span>
        <Badge tone={STATUS_TONE[campaign.status]}>{STATUS_LABEL[campaign.status]}</Badge>
      </div>

      <Link
        href={`/campaigns/${campaign.slug}`}
        className="inline-flex items-center justify-center rounded-md border border-line-strong py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white/5"
      >
        View Campaign
      </Link>
    </GlassCard>
  );
}
