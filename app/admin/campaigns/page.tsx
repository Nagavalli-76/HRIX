import type { Metadata } from "next";
import { listCampaigns } from "@/lib/api/campaigns";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatInr } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { ModerationButton } from "@/components/admin/ModerationButton";

export const metadata: Metadata = { title: "Admin · Campaigns" };

const STATUS_TONE = {
  open: "success",
  "closing-soon": "warning",
  closed: "neutral",
} as const;

export default async function AdminCampaignsPage() {
  const campaigns = await listCampaigns();
  return (
    <div>
      <h1 className="text-headline">Campaigns</h1>
      <p className="mt-2 text-muted">All campaigns listed on HRIX.</p>

      <div className="mt-8 space-y-3">
        {campaigns.length === 0 ? (
          <EmptyState title="No campaigns yet" body="Campaigns listed on HRIX will appear here." />
        ) : (
        campaigns.map((campaign) => (
          <GlassCard key={campaign.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">{campaign.title}</p>
              <p className="text-sm text-faint">
                {campaign.brandName} · {formatInr(campaign.budgetInr, true)} · Deadline {formatDate(campaign.deadline)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TrustBadge state={campaign.trust} />
              <Badge tone={STATUS_TONE[campaign.status]}>
                {campaign.status === "closing-soon" ? "Closing soon" : campaign.status[0].toUpperCase() + campaign.status.slice(1)}
              </Badge>
              {campaign.status === "closed" ? (
                <ModerationButton targetType="campaign" targetId={campaign.id} value="open" label="Reopen" />
              ) : (
                <ModerationButton targetType="campaign" targetId={campaign.id} value="closed" label="Close" variant="danger" />
              )}
            </div>
          </GlassCard>
        )))}
      </div>
    </div>
  );
}
