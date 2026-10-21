import type { Metadata } from "next";
import { listInvoices } from "@/lib/api/payments";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatInr } from "@/lib/format";

export const metadata: Metadata = { title: "Payments" };

export default async function BrandPaymentsPage() {
  const invoices = await listInvoices();

  return (
    <div>
      <h1 className="text-headline">Payments</h1>
      <p className="mt-2 text-muted">Campaign payments released to creators.</p>

      <div className="mt-8 space-y-3">
        {invoices.length === 0 ? (
          <EmptyState title="No payments yet" body="Payments released to creators will appear here once a campaign is completed." />
        ) : (
        invoices.map((invoice) => (
          <GlassCard key={invoice.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-ink">{invoice.description}</p>
              <p className="text-sm text-faint">{formatDate(invoice.issuedOn)}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium text-ink">{formatInr(invoice.amountInr)}</span>
              <Badge tone={invoice.status === "paid" ? "success" : "warning"}>
                {invoice.status[0].toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>
          </GlassCard>
        )))}
      </div>
    </div>
  );
}
