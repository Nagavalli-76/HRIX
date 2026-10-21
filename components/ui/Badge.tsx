import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  | "neutral"
  | "violet"
  | "blue"
  | "success"
  | "warning"
  | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: ReactNode;
}

const TONES: Record<BadgeTone, string> = {
  neutral: "border-line-strong bg-white/5 text-muted",
  violet: "border-violet/30 bg-violet/10 text-violet-soft",
  blue: "border-blue/30 bg-blue/10 text-blue-soft",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

export function Badge({
  tone = "neutral",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "text-label inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-1",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {icon ? (
        <span aria-hidden className="flex h-3.5 w-3.5 items-center">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
