import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { listCampaigns } from "@/lib/api/campaigns";
import { getSession } from "@/lib/api/auth";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Brand Overview" };

export default async function BrandOverviewPage() {
  const session = await getSession();
  const campaigns = await listCampaigns();
  const supabase = await createClient();
  const { data: brandProfile } = session
    ? await supabase.from("brand_profiles").select("slug").eq("user_id", session.id).single()
    : { data: null };
  const brandCampaigns = brandProfile
    ? campaigns.filter((campaign) => campaign.brandSlug === brandProfile.slug)
    : [];
  const active = brandCampaigns.filter((c) => c.status !== "closed");
  const totalApplications = brandCampaigns.reduce((sum, c) => sum + c.applicants, 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-headline">Overview</h1>
        <p className="mt-2 text-muted">A snapshot of your campaigns today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Campaigns" value={String(active.length)} />
        <StatCard label="Total Campaigns" value={String(brandCampaigns.length)} />
        <StatCard label="Applications" value={String(totalApplications)} />
        <StatCard label="Completed Campaigns" value={String(brandCampaigns.filter((c) => c.status === "closed").length)} />
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-title">Your campaigns</h2>
          <Link href="/brand/dashboard/campaigns" className="text-sm text-blue-soft underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        {brandCampaigns.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No campaigns yet"
              body="Create your first campaign to begin discovering creators on HRIX."
              actionLabel="Create Campaign"
              actionHref="/brand/dashboard/campaigns"
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {brandCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
