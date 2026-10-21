import type { Metadata } from "next";
import { getBrandDirectoryAccessStatus } from "@/lib/api/brand-access";
import { LockedCreatorDirectory } from "@/components/brand/LockedCreatorDirectory";
import { CreatorCard } from "@/components/marketing/CreatorCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { creators } from "@/data/creators";

export const metadata: Metadata = { title: "Shortlisted" };

export const dynamic = "force-dynamic";

export default async function ShortlistedPage() {
  const access = await getBrandDirectoryAccessStatus();

  if (!access.allowed) {
    return <LockedCreatorDirectory status={access} isDashboard={true} />;
  }

  const shortlist = creators.slice(0, 3);

  return (
    <div>
      <h1 className="text-headline">Shortlisted</h1>
      <p className="mt-2 text-muted">Creators you&apos;ve saved to review before deciding.</p>

      {shortlist.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No creators shortlisted yet" body="Save creators from Discover to review them here before deciding." />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shortlist.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
