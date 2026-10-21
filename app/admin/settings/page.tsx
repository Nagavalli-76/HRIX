import type { Metadata } from "next";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getCreatorPlan } from "@/data/pricing";

export const metadata: Metadata = { title: "Admin · Settings" };

export default function AdminSettingsPage() {
  const entry = getCreatorPlan("entry");
  const audit = getCreatorPlan("profile-audit");
  const growth = getCreatorPlan("creator-growth");

  return (
    <div>
      <h1 className="text-headline">Platform settings</h1>
      <p className="mt-2 text-muted">Configuration for the HRIX admin team.</p>

      <GlassCard tone="raised" className="mt-8 max-w-xl space-y-5">
        <h2 className="text-title">Membership & access pricing</h2>
        <Input label="HRIX Entry (₹/month)" type="number" defaultValue={entry?.price} />
        <Input label="Profile Audit (₹/year)" type="number" defaultValue={audit?.price} />
        <Input label="Creator Growth (₹/year)" type="number" defaultValue={growth?.price} />
        <Input label="Brand Directory Access (₹/month)" type="number" defaultValue={2999} />
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </GlassCard>
    </div>
  );
}
