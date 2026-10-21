import type { Metadata } from "next";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Admin · Reports" };

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-headline">Reports</h1>
      <p className="mt-2 text-muted">Platform-wide moderation and health signals.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Open reports" value="0" />
        <StatCard label="Resolved this month" value="0" />
        <StatCard label="Under review" value="0" />
      </div>

      <div className="mt-8">
        <EmptyState
          title="No reports yet"
          body="Reports filed by creators or brands about a listing or a message will appear here for review."
        />
      </div>
    </div>
  );
}
