import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { listApplicationsForCreator } from "@/lib/api/applications";
import { listCollaborationsForCreator } from "@/lib/api/collaborations";
import { listCampaigns } from "@/lib/api/campaigns";
import { getSession } from "@/lib/api/auth";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Creator Overview" };

export default async function CreatorOverviewPage() {
  const session = await getSession();

  const [applications, collaborations, campaigns] = await Promise.all([
    session ? listApplicationsForCreator(session.id) : Promise.resolve([]),
    session ? listCollaborationsForCreator(session.id) : Promise.resolve([]),
    listCampaigns(),
  ]);

  const accepted = collaborations.filter((c) => c.status !== "completed");
  const pendingDeliverables = collaborations.filter((c) =>
    ["active", "revision-requested"].includes(c.status),
  );
  const recommended = campaigns.slice(0, 3);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-headline">Overview</h1>
        <p className="mt-2 text-muted">Here&apos;s where things stand today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Applications" value={String(applications.length)} />
        <StatCard label="Accepted Campaigns" value={String(accepted.length)} />
        <StatCard label="Pending Deliverables" value={String(pendingDeliverables.length)} />
        <StatCard label="Collaborations" value={String(collaborations.length)} />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-title">Recommended campaigns</h2>
          <Link href="/creator/dashboard/campaigns" className="text-sm text-blue-soft underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        {recommended.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No recommended campaigns yet"
              body="Complete your profile so HRIX can start matching you with relevant brand opportunities."
              actionLabel="Complete profile"
              actionHref="/creator/dashboard/profile"
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>

      <GlassCard className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-medium text-ink">Profile completion</p>
          <p className="text-sm text-muted">Add a rate card to start receiving matched campaigns.</p>
        </div>
        <Link
          href="/creator/dashboard/profile"
          className="text-sm text-blue-soft underline-offset-4 hover:underline"
        >
          Complete profile
        </Link>
      </GlassCard>
    </div>
  );
}
