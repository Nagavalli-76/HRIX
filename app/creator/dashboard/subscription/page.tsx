import type { Metadata } from "next";
import { getSubscription, listInvoices } from "@/lib/api/payments";
import { CreatorMembershipManager } from "@/components/creator/CreatorMembershipManager";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatInr } from "@/lib/format";

export const metadata: Metadata = { title: "Membership · Creator Dashboard" };

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const [subscription, invoices] = await Promise.all([getSubscription(), listInvoices()]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-headline">Creator Membership & Services</h1>
        <p className="mt-2 text-muted">
          Manage your annual creator subscriptions, review dates, and payment history.
        </p>
      </div>

      {/* Interactive Creator Membership & Plan Manager */}
      <CreatorMembershipManager initialSubscription={subscription} />

      {/* Payment History / Invoices */}
      <div>
        <h2 className="text-title">Payment & Invoice History</h2>
        <p className="mt-1 text-sm text-muted">
          Official receipts and payment confirmation records for your creator subscriptions.
        </p>

        <div className="mt-5 space-y-3">
          {invoices.length === 0 ? (
            <EmptyState
              title="No invoices yet"
              body="Invoices for your membership, Profile Audit (₹499/year) or Creator Growth (₹999/year) plans will be listed here upon confirmation."
            />
          ) : (
            invoices.map((invoice) => (
              <GlassCard key={invoice.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium text-ink">{invoice.description}</p>
                  <p className="text-xs text-faint">Issued on {formatDate(invoice.issuedOn)} · ID: {invoice.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-ink">{formatInr(invoice.amountInr)}</span>
                  <Badge tone={invoice.status === "paid" ? "success" : invoice.status === "due" ? "warning" : "danger"}>
                    {invoice.status[0].toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
