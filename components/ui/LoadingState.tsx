import { HrixLogo } from "@/components/brand/HrixLogo";
import { cn } from "@/lib/cn";

export interface LoadingStateProps {
  /** Announced to screen readers. */
  label?: string;
  /** Covers the whole viewport. Turn off to fill just the parent area. */
  fullscreen?: boolean;
  className?: string;
}

/** Branded loading screen using the official logo. */
export function LoadingState({
  label = "Loading HRIX",
  fullscreen = true,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-8 bg-canvas",
        fullscreen ? "fixed inset-0 z-[100]" : "min-h-[50vh] w-full",
        className,
      )}
    >
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent)]"
        />
        <HrixLogo variant="loading" priority className="animate-logo-breathe" />
      </div>
      <span className="sr-only">{label}</span>
      <div aria-hidden className="h-px w-40 overflow-hidden bg-line">
        <span className="block h-full w-1/3 animate-loader-slide bg-gradient-to-r from-violet to-blue" />
      </div>
    </div>
  );
}
