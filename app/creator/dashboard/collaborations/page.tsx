import type { Metadata } from "next";
import { listCollaborationsForCreator } from "@/lib/api/collaborations";
import { getSession } from "@/lib/api/auth";
import { campaigns } from "@/data/campaigns";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CollaborationTimeline } from "@/components/dashboard/CollaborationTimeline";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = { title: "Collaborations" };

export default async function CollaborationsPage() {
  const session = await getSession();
  const collaborations = session ? await listCollaborationsForCreator(session.id) : [];

  if (collaborations.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="h-8 w-8" />}
        title="No collaborations yet"
        body="Once a brand accepts your application, it'll show up here."
        actionLabel="Discover campaigns"
        actionHref="/creator/dashboard/campaigns"
      />
    );
  }

  return (
    <div>
      <h1 className="text-headline">Collaborations</h1>
      <p className="mt-2 text-muted">Where each of your active campaigns stands right now.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {collaborations.map((collab) => {
          const campaign = campaigns.find((c) => c.id === collab.campaignId);
          return (
            <GlassCard key={collab.id}>
              <p className="font-medium text-ink">{campaign?.title ?? "Campaign"}</p>
              <p className="mb-6 text-sm text-faint">{campaign?.brandName}</p>
              <CollaborationTimeline status={collab.status} timeline={collab.timeline} />
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
