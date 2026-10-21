import Link from "next/link";
import { MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Badge } from "@/components/ui/Badge";
import type { Brand } from "@/types";

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <GlassCard as="article" interactive className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-ink">{brand.name}</h3>
        <TrustBadge state={brand.trust} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-faint" aria-hidden />
          {brand.city}
        </span>
        <Badge>{brand.industry}</Badge>
      </div>

      <p className="text-sm text-muted">{brand.description}</p>

      <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
        <div>
          <dt className="text-faint">Active campaigns</dt>
          <dd className="font-medium text-ink">{brand.activeCampaigns}</dd>
        </div>
        <div>
          <dt className="text-faint">Completed</dt>
          <dd className="font-medium text-ink">{brand.completedCampaigns}</dd>
        </div>
      </dl>

      <Link
        href={`/brands/${brand.slug}`}
        className="inline-flex items-center justify-center rounded-md border border-line-strong py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white/5"
      >
        View Brand
      </Link>
    </GlassCard>
  );
}
