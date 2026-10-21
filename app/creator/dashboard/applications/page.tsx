import type { Metadata } from "next";
import { listApplicationsForCreator } from "@/lib/api/applications";
import { getSession } from "@/lib/api/auth";
import { getCampaign } from "@/lib/api/campaigns";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import { ListChecks } from "lucide-react";
import type { ApplicationStatus } from "@/types";
import { WithdrawApplicationButton } from "@/components/creator/WithdrawApplicationButton";

export const metadata: Metadata = { title: "Applications" };

const STATUS_TONE: Record<ApplicationStatus, "neutral" | "violet" | "success" | "danger"> = {
  submitted: "neutral",
  shortlisted: "violet",
  accepted: "success",
  rejected: "danger",
  withdrawn: "neutral",
};

export default async function ApplicationsPage() {
  const session = await getSession();
  const applications = session ? await listApplicationsForCreator(session.id) : [];
  const campaigns = await Promise.all(applications.map((application) =>
    getCampaignById(application.campaignId),
  ));
  const rows = applications.map((application, index) => ({ application, campaign: campaigns[index] }));

  return (
    <div>
      <h1 className="text-headline">Applications</h1>
      <p className="mt-2 text-muted">Track the status of every campaign you&apos;ve applied to.</p>

      <div className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="h-8 w-8" />}
            title="No applications yet"
            body="Apply to a campaign to see its status here."
            actionLabel="Discover campaigns"
            actionHref="/creator/dashboard/campaigns"
          />
        ) : (
          rows.map(({ application, campaign }) => (
            <GlassCard
              key={application.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-ink">{campaign?.title ?? "Campaign"}</p>
                <p className="text-sm text-faint">{campaign?.brandName}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-faint">
                  Applied {formatDate(application.submittedOn)}
                </span>
                <Badge tone={STATUS_TONE[application.status]}>
                  {application.status[0].toUpperCase() + application.status.slice(1)}
                </Badge>
                {application.status === "submitted" || application.status === "shortlisted" ? (
                  <WithdrawApplicationButton applicationId={application.id} />
                ) : null}
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

async function getCampaignById(id: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("campaigns").select("slug").eq("id", id).maybeSingle();
  return data?.slug ? getCampaign(data.slug) : undefined;
}
