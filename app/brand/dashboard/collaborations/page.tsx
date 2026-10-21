import type { Metadata } from "next";
import { listCollaborationsForCampaign } from "@/lib/api/collaborations";
import { listCampaignsForCurrentBrand } from "@/lib/api/campaigns";
import { creators } from "@/data/creators";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CollaborationTimeline } from "@/components/dashboard/CollaborationTimeline";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = { title: "Collaborations" };

export default async function BrandCollaborationsPage() {
  const brandCampaigns = await listCampaignsForCurrentBrand();
  const lists = await Promise.all(
    brandCampaigns.map((c) => listCollaborationsForCampaign(c.id)),
  );
  const collaborations = lists.flat();

  if (collaborations.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase className="h-8 w-8" />}
        title="No active collaborations"
        body="Accepted applications will turn into collaborations here."
      />
    );
  }

  return (
    <div>
      <h1 className="text-headline">Collaborations</h1>
      <p className="mt-2 text-muted">Track each creator&apos;s progress on your campaigns.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {collaborations.map((collab) => {
          const creator = creators.find((c) => c.id === collab.creatorId);
          const campaign = brandCampaigns.find((c) => c.id === collab.campaignId);
          return (
            <GlassCard key={collab.id}>
              <p className="font-medium text-ink">{creator?.name ?? "Creator"}</p>
              <p className="mb-6 text-sm text-faint">{campaign?.title}</p>
              <CollaborationTimeline status={collab.status} timeline={collab.timeline} />
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
