import type { Metadata } from "next";
import { getCreator } from "@/lib/api/creators";
import { getSession } from "@/lib/api/auth";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { FolderKanban } from "lucide-react";

export const metadata: Metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const session = await getSession();
  const creator = session ? await getCreator(session.id) : undefined;
  const items = creator?.portfolio ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-headline">Portfolio</h1>
          <p className="mt-2 text-muted">Work you want brands to see first.</p>
        </div>
        <Button size="sm">Add work</Button>
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<FolderKanban className="h-8 w-8" />}
            title="Your portfolio is empty"
            body="Add a few pieces of work so brands know what to expect."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GlassCard key={item.id}>
              <p className="font-medium text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-faint">
                {item.brand ? `${item.brand} · ` : ""}
                {item.category}
              </p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
