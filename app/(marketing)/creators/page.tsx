import type { Metadata } from "next";
import { listCreators } from "@/lib/api/creators";
import { getBrandDirectoryAccessStatus } from "@/lib/api/brand-access";
import { CreatorCard } from "@/components/marketing/CreatorCard";
import { LockedCreatorDirectory } from "@/components/brand/LockedCreatorDirectory";
import { EmptyState } from "@/components/ui/EmptyState";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import type { Category, City } from "@/types";

export const metadata: Metadata = {
  title: "Discover Creators · HRIX",
  description: "Explore verified creator profiles and find the right partners for your brand campaigns.",
  alternates: {
    canonical: "/creators",
  },
  openGraph: {
    title: "Discover Creators · HRIX",
    description: "Explore verified creator profiles and find the right partners for your brand campaigns.",
    url: "https://hrixofficial.in/creators",
    siteName: "HRIX",
  },
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams?: Promise<{
    category?: Category;
    city?: City;
    query?: string;
  }>;
}

export default async function CreatorsPage({ searchParams }: Props) {
  const access = await getBrandDirectoryAccessStatus();

  // Public visitors, creators, unverified brands, and unpaid brands see the locked screen
  if (!access.allowed) {
    return (
      <div className="container-page py-16 md:py-20">
        <LockedCreatorDirectory status={access} />
      </div>
    );
  }

  // Only eligible brands and admins reach this point
  const resolvedParams = searchParams ? await searchParams : {};
  const creators = await listCreators(resolvedParams);

  return (
    <div className="container-page py-16 md:py-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-headline">Discover Creators</h1>
        <p className="max-w-xl text-muted">
          Browse verified creator profiles and find the right partners for your brand campaigns.
        </p>
      </div>

      {creators.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No creators found"
            body="No creators matched the current filter or search criteria."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
