import Link from "next/link";
import { MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { Badge } from "@/components/ui/Badge";
import { formatFollowers } from "@/lib/format";
import type { Creator } from "@/types";

export function CreatorCard({ creator }: { creator: Creator }) {
  const primaryPlatform = creator.platforms[0];

  return (
    <GlassCard
      as="article"
      interactive
      className="group flex h-full flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={creator.name} size="lg" />
          <div>
            <h3 className="font-medium leading-tight text-ink">{creator.name}</h3>
            <p className="text-sm text-faint">{creator.username}</p>
          </div>
        </div>
        <TrustBadge state={creator.trust} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-faint" aria-hidden />
          {creator.city}
        </span>
        <Badge>{creator.category}</Badge>
      </div>

      {primaryPlatform ? (
        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
          <div>
            <p className="text-faint">{primaryPlatform.platform} followers</p>
            <p className="font-medium text-ink">{formatFollowers(primaryPlatform.followers)}</p>
          </div>
          <div>
            <p className="text-faint">Engagement</p>
            <p className="font-medium text-ink">{primaryPlatform.engagementRate}%</p>
          </div>
        </div>
      ) : null}

      <Link
        href={`/creators/${creator.slug}`}
        className="mt-1 inline-flex items-center justify-center rounded-md border border-line-strong py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white/5"
      >
        View Profile
      </Link>
    </GlassCard>
  );
}
