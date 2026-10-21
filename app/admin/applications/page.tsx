import type { Metadata } from "next";
import { listCampaigns } from "@/lib/api/campaigns";
import { listApplicationsForCampaign } from "@/lib/api/applications";
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import type { ApplicationStatus } from "@/types";
import { ModerationButton } from "@/components/admin/ModerationButton";

export const metadata: Metadata = { title: "Admin · Applications" };

const STATUS_TONE: Record<ApplicationStatus, "neutral" | "violet" | "success" | "danger"> = {
  submitted: "neutral",
  shortlisted: "violet",
  accepted: "success",
  rejected: "danger",
  withdrawn: "neutral",
};

export default async function AdminApplicationsPage() {
  const campaigns = await listCampaigns();
  const lists = await Promise.all(campaigns.map((c) => listApplicationsForCampaign(c.id)));
  const applications = lists.flat();

  return (
    <div>
      <h1 className="text-headline">Applications</h1>
      <p className="mt-2 text-muted">Every application submitted across all campaigns.</p>

      <div className="mt-8 space-y-3">
        {applications.length === 0 && (
          <EmptyState title="No applications yet" body="Applications submitted across all campaigns will appear here." />
        )}
        {applications.map((application) => {
          const campaign = campaigns.find((c) => c.id === application.campaignId);
          if (!campaign) return null;
          return (
            <GlassCard key={application.id} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={application.creatorName ?? "Creator"} />
                <div>
                  <p className="font-medium text-ink">{application.creatorName ?? "Creator"}</p>
                  <p className="text-sm text-faint">
                    {campaign.title} · {campaign.brandName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-faint">{formatDate(application.submittedOn)}</span>
                <Badge tone={STATUS_TONE[application.status]}>
                  {application.status[0].toUpperCase() + application.status.slice(1)}
                </Badge>
                {application.status === "submitted" ? (
                  <ModerationButton targetType="application" targetId={application.id} value="shortlisted" label="Shortlist" />
                ) : null}
                {application.status === "shortlisted" ? (
                  <ModerationButton targetType="application" targetId={application.id} value="rejected" label="Reject" variant="danger" />
                ) : null}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
