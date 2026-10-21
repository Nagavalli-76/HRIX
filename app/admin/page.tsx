import type { Metadata } from "next";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const [creators, brands, activeCampaigns, totalCampaigns, pendingVerification] = await Promise.all([
    supabase.from("creator_profiles").select("id", { count: "exact", head: true }),
    supabase.from("brand_profiles").select("id", { count: "exact", head: true }),
    supabase.from("campaigns").select("id", { count: "exact", head: true }).neq("status", "closed"),
    supabase.from("campaigns").select("id", { count: "exact", head: true }),
    supabase
      .from("verification_requests")
      .select("id, entity_type, status, entity_id", { count: "exact" })
      .in("status", ["verification-pending", "action-required"]),
  ]);

  const queryErrors = [creators, brands, activeCampaigns, totalCampaigns, pendingVerification]
    .map((result) => result.error)
    .filter(Boolean);
  if (queryErrors.length > 0) {
    console.error("Error loading admin overview:", queryErrors);
    throw new Error("Unable to load admin overview.");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-headline">Overview</h1>
        <p className="mt-2 text-muted">Platform activity across creators, brands and campaigns.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered Creators" value={String(creators.count ?? 0)} />
        <StatCard label="Brands" value={String(brands.count ?? 0)} />
        <StatCard label="Active Campaigns" value={String(activeCampaigns.count ?? 0)} />
        <StatCard label="Total Campaigns" value={String(totalCampaigns.count ?? 0)} />
      </div>

      <section>
        <h2 className="text-title">Needs attention</h2>
        {pendingVerification.data?.length === 0 ? (
          <p className="mt-4 text-sm text-faint">Nothing pending right now.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {pendingVerification.data?.map((entity) => (
              <GlassCard key={entity.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">{entity.entity_type === "creator" ? "Creator" : "Brand"}</p>
                  <p className="text-sm text-faint">
                    Entity {entity.entity_id.slice(0, 8)}
                  </p>
                </div>
                <Badge tone={entity.status === "action-required" ? "danger" : "warning"}>
                  {entity.status === "action-required" ? "Action Required" : "Verification Pending"}
                </Badge>
              </GlassCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
