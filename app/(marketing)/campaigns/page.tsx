import type { Metadata } from "next";
import { listCampaigns } from "@/lib/api/campaigns";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Open Creator Campaigns & Brand Collaborations · HRIX",
  description:
    "Explore active creator campaigns from verified brands. Filter by category, platform, and compensation models on the HRIX network.",
  alternates: {
    canonical: "/campaigns",
  },
  openGraph: {
    title: "Open Creator Campaigns & Brand Collaborations · HRIX",
    description:
      "Explore active creator campaigns from verified brands. Filter by category, platform, and compensation models on the HRIX network.",
    url: "https://hrixofficial.in/campaigns",
    siteName: "HRIX",
  },
};

export default async function CampaignsPage() {
  const campaigns = await listCampaigns();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Campaigns", path: "/campaigns" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="container-page py-16 md:py-20">
      <h1 className="text-headline">Open campaigns</h1>
      <p className="mt-4 max-w-xl text-muted">
        Browse campaigns from brands looking for creators like you.
      </p>

      {campaigns.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No campaigns to show yet" body="Open campaigns from HRIX brands will appear here once they are live." />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
      )}
    </div>
    </>
  );
}
