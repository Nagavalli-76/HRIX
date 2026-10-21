import type { Metadata } from "next";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { listInvoices } from "@/lib/api/payments";
import { formatDate, formatInr } from "@/lib/format";

export const metadata: Metadata = { title: "Earnings" };

export default async function EarningsPage() {
  const invoices = await listInvoices();
  const paidTotal = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amountInr, 0);
  const pendingTotal = invoices
    .filter((invoice) => invoice.status === "due")
    .reduce((sum, invoice) => sum + invoice.amountInr, 0);

  return (
    <div>
      <h1 className="text-headline">Earnings</h1>
      <p className="mt-2 text-muted">Payments released for completed deliverables.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Lifetime released" value={formatInr(paidTotal)} />
        <StatCard label="Pending" value={formatInr(pendingTotal)} />
        <StatCard label="Payment records" value={String(invoices.length)} />
      </div>

      <h2 className="text-title mt-10">Payment history</h2>
      <div className="mt-4 space-y-3">
        {invoices.length === 0 ? (
          <EmptyState
            title="No earnings yet"
            body="Payments released for completed deliverables will appear here once a campaign is completed and payments are connected."
          />
        ) : (
          invoices.map((invoice) => (
            <GlassCard key={invoice.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-ink">{invoice.description}</p>
                <p className="text-sm text-faint">{formatDate(invoice.issuedOn)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-ink">{formatInr(invoice.amountInr)}</span>
                <Badge tone={invoice.status === "paid" ? "success" : invoice.status === "due" ? "warning" : "danger"}>
                  {invoice.status[0].toUpperCase() + invoice.status.slice(1)}
                </Badge>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
