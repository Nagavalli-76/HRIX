import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  /** True while the number is placeholder data. Shows a "Demo data" badge so it is never read as a real HRIX figure. */
  demo?: boolean;
}

export function StatCard({ label, value, hint, icon, demo = false }: StatCardProps) {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-label text-muted">{label}</span>
        {icon ? (
          <span aria-hidden className="text-faint">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="font-display text-4xl font-semibold tabular-nums tracking-tight">
        {value}
      </div>
      {hint || demo ? (
        <div className="flex items-center justify-between gap-3">
          {hint ? <span className="text-sm text-faint">{hint}</span> : <span />}
          {demo ? <Badge>Demo data</Badge> : null}
        </div>
      ) : null}
    </GlassCard>
  );
}
