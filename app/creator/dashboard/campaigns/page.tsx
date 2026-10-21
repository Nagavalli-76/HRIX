import type { Metadata } from "next";
import { listCampaigns } from "@/lib/api/campaigns";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Discover Campaigns" };

export default async function DiscoverCampaignsPage() {
  const campaigns = await listCampaigns();

  return (
    <div>
      <h1 className="text-headline">Discover campaigns</h1>
      <p className="mt-2 text-muted">Campaigns matched to your category and audience.</p>

      {campaigns.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No campaigns available yet" body="Campaigns matched to your category and audience will appear here once they are live." />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
      )}
    </div>
  );
}
