import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Verified } from "lucide-react";
import { getCreator } from "@/lib/api/creators";
import { getBrandDirectoryAccessStatus } from "@/lib/api/brand-access";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LockedCreatorDirectory } from "@/components/brand/LockedCreatorDirectory";
import { formatDate, formatFollowers } from "@/lib/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const creator = await getCreator(slug);
  // Do not expose creator name in metadata to unauthorized viewers
  return { title: creator ? `${creator.name} · Creator Profile` : "Discover Creators · HRIX" };
}

export default async function CreatorProfilePage({ params }: Props) {
  const { slug } = await params;
  const access = await getBrandDirectoryAccessStatus();
  const creator = await getCreator(slug);

  if (!creator) {
    if (!access.allowed) {
      return (
        <div className="container-page py-16 md:py-20">
          <LockedCreatorDirectory status={access} />
        </div>
      );
    }
    notFound();
  }

  return (
    <div className="container-page py-16 md:py-20">
      {/* Hero */}
      <section className="flex flex-col gap-6 border-b border-line/70 pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-5">
          <Avatar name={creator.name} size="xl" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-headline">{creator.name}</h1>
              <TrustBadge state={creator.trust} />
            </div>
            <p className="mt-1 text-muted">{creator.username}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-faint" aria-hidden />
                {creator.city}
              </span>
              <Badge>{creator.category}</Badge>
              <span className="text-faint">Joined {formatDate(creator.joinedOn)}</span>
            </div>
          </div>
        </div>
        <Button href="/brand/dashboard/messages" variant="secondary">
          Message creator
        </Button>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          {/* About */}
          <section>
            <h2 className="text-title">About</h2>
            <p className="mt-3 max-w-2xl text-muted">{creator.bio || "No bio provided."}</p>
          </section>

          {/* Platforms & audience */}
          <section>
            <h2 className="text-title">Platforms & audience</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {creator.platforms.length === 0 ? (
                <p className="text-sm text-faint">No linked platforms registered yet.</p>
              ) : (
                creator.platforms.map((platform) => (
                  <GlassCard key={platform.platform} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="inline-flex items-center gap-1.5 font-medium text-ink">
                        {platform.platform}
                        <Verified className="h-3.5 w-3.5 text-blue-soft" aria-hidden />
                      </p>
                      <p className="text-sm text-faint">{platform.handle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-ink">{formatFollowers(platform.followers)}</p>
                      <p className="text-sm text-faint">{platform.engagementRate}% engagement</p>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </section>

          {/* Portfolio */}
          <section>
            <h2 className="text-title">Portfolio</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {creator.portfolio.length === 0 ? (
                <p className="text-sm text-faint">No portfolio items added yet.</p>
              ) : (
                creator.portfolio.map((item) => (
                  <GlassCard key={item.id}>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="mt-1 text-sm text-faint">
                      {item.brand ? `${item.brand} · ` : ""}
                      {item.category}
                    </p>
                  </GlassCard>
                ))
              )}
            </div>
          </section>

          {/* Collaboration history */}
          <section>
            <h2 className="text-title">Campaign history</h2>
            {creator.collaborations.length > 0 ? (
              <ul className="mt-4 divide-y divide-line">
                {creator.collaborations.map((collab) => (
                  <li key={collab.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium text-ink">{collab.campaignTitle}</p>
                      <p className="text-sm text-faint">{collab.brandName}</p>
                    </div>
                    <span className="text-sm text-faint">{formatDate(collab.completedOn)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-faint">No completed campaigns yet.</p>
            )}
          </section>
        </div>

        {/* Sidebar: rate + match */}
        <aside className="space-y-6">
          <GlassCard tone="raised">
            <p className="text-label text-muted">Starting rate</p>
            <p className="font-display mt-2 text-3xl font-semibold">
              ₹{creator.startingRateInr.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-faint">Per deliverable, negotiable per campaign</p>
          </GlassCard>
          <p className="text-sm text-faint">
            Rate shown is indicative, set by the creator, and not a quote for every campaign.
          </p>
        </aside>
      </div>
    </div>
  );
}
