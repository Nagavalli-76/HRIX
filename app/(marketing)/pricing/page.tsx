import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import { creatorPlans } from "@/data/pricing";

export const metadata: Metadata = { title: "Pricing" };

const COMPARISON_ROWS: { label: string; values: [boolean, boolean, boolean] }[] = [
  { label: "Creator registration & profile setup", values: [true, true, true] },
  { label: "Public creator profile & dashboard", values: [true, true, true] },
  { label: "Basic opportunity access when available", values: [true, true, true] },
  { label: "Personal profile audit & suggestions", values: [false, true, true] },
  { label: "Bio & portfolio optimization suggestions", values: [false, true, true] },
  { label: "Creator positioning strategy", values: [false, false, true] },
  { label: "Content direction suggestions", values: [false, false, true] },
  { label: "Brand-readiness checklist", values: [false, false, true] },
  { label: "Personalized creator growth roadmap", values: [false, false, true] },
];

export default function PricingPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-display">Choose how you want to grow with HRIX</h1>
        <p className="mt-4 text-muted">
          Start with access, improve your profile, or take the complete
          creator growth path. There is no HRIX listing fee for brands to
          launch a campaign.
        </p>
      </div>

      <div className="mt-14">
        <PricingTiers />
      </div>

      <div className="mt-20">
        <h2 className="text-headline text-center">Compare plans</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-4 pr-4 font-medium text-muted">Included</th>
                {creatorPlans.map((plan) => (
                  <th key={plan.id} className="px-4 py-4 text-center font-medium text-ink">
                    {plan.name}
                    <span className="mt-1 block text-xs font-normal text-faint">
                      ₹{plan.price}{plan.billingPeriod} · {plan.renewalNote}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line/70">
                  <td className="py-4 pr-4 text-muted">{row.label}</td>
                  {row.values.map((included, i) => (
                    <td key={i} className="px-4 py-4 text-center">
                      {included ? (
                        <Check className="mx-auto h-4 w-4 text-violet-soft" aria-hidden />
                      ) : (
                        <Minus className="mx-auto h-4 w-4 text-faint" aria-hidden />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-faint">
          All creator service plans (Profile Audit at ₹499/year and Creator Growth at ₹999/year) are billed as annual subscriptions valid for 12 months.
          Subscriptions do not auto-debit cards repeatedly; renewal is manual upon expiration with explicit user consent.
          None of these plans guarantee followers, income, brand deals or
          viral content — they provide structured access, review, and
          strategic direction for your creator profile.
        </p>
      </div>
    </div>
  );
}
