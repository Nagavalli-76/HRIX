import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-headline">Analytics</h1>
      <p className="mt-2 text-muted">Campaign performance across your creator network.</p>

      <div className="mt-8">
        <EmptyState
          title="Analytics will appear once activity is available"
          body="Reach, engagement and spend for your campaigns will populate here once campaign reporting is connected to a live data source."
        />
      </div>
    </div>
  );
}
