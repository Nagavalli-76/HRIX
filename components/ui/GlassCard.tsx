import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type GlassCardTone = "default" | "raised" | "accent";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: GlassCardTone;
  /** Adds standard inner padding. Turn off for cards that manage their own layout. */
  padded?: boolean;
  /** Render as a different element, e.g. "article" for a card in a list. */
  as?: ElementType;
  /** Adds a subtle lift + border glow on hover, for cards meant to feel clickable/premium. */
  interactive?: boolean;
}

const TONES: Record<GlassCardTone, string> = {
  default: "border-line bg-surface/70",
  raised: "border-line-strong bg-surface-raised/80",
  // A single hairline of light across the top edge; use on one card per view.
  accent:
    "border-line bg-surface/70 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-violet/70 before:to-transparent",
};

export function GlassCard({
  tone = "default",
  padded = true,
  as,
  interactive = false,
  className,
  ...props
}: GlassCardProps) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "relative rounded-lg border shadow-panel backdrop-blur-md",
        TONES[tone],
        padded && "p-5 md:p-6",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 will-change-transform hover:-translate-y-1 hover:border-violet/40 hover:shadow-glow-violet",
        className,
      )}
      {...props}
    />
  );
}
