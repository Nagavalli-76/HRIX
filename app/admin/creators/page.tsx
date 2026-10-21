import type { Metadata } from "next";
import { listCreators } from "@/lib/api/creators";
import { Avatar } from "@/components/ui/Avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ModerationButton } from "@/components/admin/ModerationButton";

export const metadata: Metadata = { title: "Admin · Creators" };

export default async function AdminCreatorsPage() {
  const creators = await listCreators({}, { bypassAuth: true });
  return (
    <div>
      <h1 className="text-headline">Creators</h1>
      <p className="mt-2 text-muted">All creators registered on HRIX.</p>

      <div className="mt-8 space-y-3">
        {creators.length === 0 ? (
          <EmptyState title="No creators registered yet" body="Creator registrations will appear here." />
        ) : (
        creators.map((creator) => (
          <GlassCard key={creator.id} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={creator.name} />
              <div>
                <p className="font-medium text-ink">{creator.name}</p>
                <p className="text-sm text-faint">
                  {creator.username} · {creator.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge>{creator.category}</Badge>
              <TrustBadge state={creator.trust} />
              <ModerationButton targetType="creator" targetId={creator.id} value="verified-creator" label="Approve" />
              <ModerationButton targetType="creator" targetId={creator.id} value="action-required" label="Request info" variant="ghost" promptReason />
            </div>
          </GlassCard>
        )))}
      </div>
    </div>
  );
}
