import type { Metadata } from "next";
import { listCampaignsForCurrentBrand } from "@/lib/api/campaigns";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CampaignForm } from "@/components/brand/CampaignForm";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "My Campaigns" };

export default async function BrandCampaignsPage() {
  const brandCampaigns = await listCampaignsForCurrentBrand();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-headline">My campaigns</h1>
      </div>
      <CampaignForm />
      {brandCampaigns.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No campaigns yet"
            body="Create your first campaign to begin discovering creators."
            actionLabel="Create Campaign"
            actionHref="/brand/dashboard/campaigns"
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brandCampaigns.map((campaign) => (
            <div key={campaign.id} className="space-y-3">
              <CampaignCard campaign={campaign} />
              <Button href={`/brand/dashboard/campaigns/${campaign.id}/edit`} variant="secondary" size="sm" className="w-full">
                Edit campaign
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
