import { cn } from "@/lib/cn";

export interface ProgressBarProps {
  /** 0 to 100. */
  value: number;
  /** Accessible name and visible caption, e.g. "Profile completion". */
  label: string;
  showValue?: boolean;
  tone?: "accent" | "success";
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  tone = "accent",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-label text-muted">{label}</span>
        {showValue ? (
          <span className="text-label tabular-nums text-ink">{clamped}%</span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            tone === "accent"
              ? "bg-gradient-to-r from-violet to-blue"
              : "bg-success",
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
