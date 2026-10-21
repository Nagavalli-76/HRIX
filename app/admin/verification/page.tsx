import type { Metadata } from "next";
import { listCreators } from "@/lib/api/creators";
import { listBrands } from "@/lib/api/brands";
import { Avatar } from "@/components/ui/Avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldCheck } from "lucide-react";
import { ModerationButton } from "@/components/admin/ModerationButton";

export const metadata: Metadata = { title: "Admin · Verification" };

export default async function VerificationPage() {
  const [creators, brands] = await Promise.all([listCreators(), listBrands()]);
  const pendingCreators = creators.filter(
    (c) => c.trust === "verification-pending" || c.trust === "action-required",
  );
  const pendingBrands = brands.filter(
    (b) => b.trust === "verification-pending" || b.trust === "action-required",
  );
  const queue = [
    ...pendingCreators.map((c) => ({ kind: "Creator" as const, name: c.name, trust: c.trust, id: c.id })),
    ...pendingBrands.map((b) => ({ kind: "Brand" as const, name: b.name, trust: b.trust, id: b.id })),
  ];

  return (
    <div>
      <h1 className="text-headline">Verification queue</h1>
      <p className="mt-2 text-muted">Review identity and business checks before granting a verified badge.</p>

      <div className="mt-8 space-y-3">
        {queue.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="h-8 w-8" />}
            title="Queue is clear"
            body="No creators or brands are waiting on verification right now."
          />
        ) : (
          queue.map((entry) => (
            <GlassCard key={`${entry.kind}-${entry.id}`} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar name={entry.name} />
                <div>
                  <p className="font-medium text-ink">{entry.name}</p>
                  <p className="text-sm text-faint">{entry.kind}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrustBadge state={entry.trust} />
                <ModerationButton
                  targetType={entry.kind === "Creator" ? "creator" : "brand"}
                  targetId={entry.id}
                  value={entry.kind === "Creator" ? "verified-creator" : "verified-brand"}
                  label="Approve"
                />
                <ModerationButton
                  targetType={entry.kind === "Creator" ? "creator" : "brand"}
                  targetId={entry.id}
                  value="action-required"
                  label="Request info"
                  variant="ghost"
                  promptReason
                />
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
