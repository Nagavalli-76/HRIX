import Image from "next/image";
import { cn } from "@/lib/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  name: string;
  /** Local or allow-listed remote image. Falls back to initials when absent. */
  src?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZES: Record<AvatarSize, { box: string; text: string; px: number }> = {
  sm: { box: "h-8 w-8", text: "text-xs", px: 32 },
  md: { box: "h-10 w-10", text: "text-sm", px: 40 },
  lg: { box: "h-14 w-14", text: "text-base", px: 56 },
  xl: { box: "h-24 w-24", text: "text-2xl", px: 96 },
};

const TINTS = [
  "bg-violet/15 text-violet-soft",
  "bg-blue/15 text-blue-soft",
  "bg-magenta/15 text-magenta-soft",
];

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** Stable tint per name so the same person always gets the same colour. */
function tintFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TINTS[hash % TINTS.length];
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const s = SIZES[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong font-medium",
        s.box,
        !src && [tintFor(name), s.text],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={s.px}
          height={s.px}
          className="h-full w-full object-cover"
        />
      ) : (
        <span role="img" aria-label={name}>
          {initialsOf(name)}
        </span>
      )}
    </span>
  );
}
