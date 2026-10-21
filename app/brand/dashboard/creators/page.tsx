import type { Metadata } from "next";
import { listCreators } from "@/lib/api/creators";
import { getBrandDirectoryAccessStatus } from "@/lib/api/brand-access";
import { CreatorCard } from "@/components/marketing/CreatorCard";
import { LockedCreatorDirectory } from "@/components/brand/LockedCreatorDirectory";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Discover Creators" };

export const dynamic = "force-dynamic";

export default async function BrandDiscoverCreatorsPage() {
  const access = await getBrandDirectoryAccessStatus();

  if (!access.allowed) {
    return <LockedCreatorDirectory status={access} isDashboard={true} />;
  }

  const creators = await listCreators();

  return (
    <div>
      <h1 className="text-headline">Discover creators</h1>
      <p className="mt-2 text-muted">Filter by category, location, audience and engagement.</p>

      {creators.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No creators to discover yet"
            body="Creator discovery will appear here once creators register in your category."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
