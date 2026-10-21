import type { Metadata } from "next";
import { listApplicationsForCampaign } from "@/lib/api/applications";
import { listCampaignsForCurrentBrand } from "@/lib/api/campaigns";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { ListChecks } from "lucide-react";
import type { ApplicationStatus } from "@/types";
import { ApplicationReviewActions } from "@/components/brand/ApplicationReviewActions";

export const metadata: Metadata = { title: "Applications" };

const STATUS_TONE: Record<ApplicationStatus, "neutral" | "violet" | "success" | "danger"> = {
  submitted: "neutral",
  shortlisted: "violet",
  accepted: "success",
  rejected: "danger",
  withdrawn: "neutral",
};

export default async function BrandApplicationsPage() {
  const brandCampaigns = await listCampaignsForCurrentBrand();
  const applicationLists = await Promise.all(
    brandCampaigns.map((campaign) => listApplicationsForCampaign(campaign.id)),
  );
  const applications = applicationLists.flat();

  return (
    <div>
      <h1 className="text-headline">Applications</h1>
      <p className="mt-2 text-muted">Creators who have applied to your campaigns.</p>

      <div className="mt-8 space-y-3">
        {applications.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="h-8 w-8" />}
            title="No applications yet"
            body="Applications will appear here once creators apply to your campaigns."
          />
        ) : (
          applications.map((application) => {
            const campaign = brandCampaigns.find((c) => c.id === application.campaignId);
            return (
              <GlassCard key={application.id} className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={application.creatorName ?? "Creator"} />
                  <div>
                    <p className="font-medium text-ink">{application.creatorName ?? "Creator"}</p>
                    <p className="text-sm text-faint">{campaign?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-faint">{formatDate(application.submittedOn)}</span>
                  <Badge tone={STATUS_TONE[application.status]}>
                    {application.status[0].toUpperCase() + application.status.slice(1)}
                  </Badge>
                  {application.status === "submitted" || application.status === "shortlisted" ? (
                    <ApplicationReviewActions applicationId={application.id} />
                  ) : null}
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
