import type { Metadata } from "next";
import { listBrands } from "@/lib/api/brands";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ModerationButton } from "@/components/admin/ModerationButton";

export const metadata: Metadata = { title: "Admin · Brands" };

export default async function AdminBrandsPage() {
  const brands = await listBrands();
  return (
    <div>
      <h1 className="text-headline">Brands</h1>
      <p className="mt-2 text-muted">All businesses registered on HRIX.</p>

      <div className="mt-8 space-y-3">
        {brands.length === 0 ? (
          <EmptyState title="No brands registered yet" body="Brand registrations will appear here." />
        ) : (
        brands.map((brand) => (
          <GlassCard key={brand.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">{brand.name}</p>
              <p className="text-sm text-faint">{brand.city}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge>{brand.industry}</Badge>
              <TrustBadge state={brand.trust} />
              <ModerationButton targetType="brand" targetId={brand.id} value="verified-brand" label="Approve" />
              <ModerationButton targetType="brand" targetId={brand.id} value="action-required" label="Request info" variant="ghost" promptReason />
            </div>
          </GlassCard>
        )))}
      </div>
    </div>
  );
}
