import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * The official HRIX logo.
 *
 * Always renders the supplied artwork from /public/brand/hrix-logo.png.
 * Never rebuild it in text, recolour it, stretch it or put it in a box.
 * The file is the supplied logo with its empty transparent margins trimmed,
 * so it sits flush against whatever spacing the layout gives it.
 */

export const LOGO_SRC = "/brand/hrix-logo.png";
export const LOGO_WIDTH = 366;
export const LOGO_HEIGHT = 130;

export type HrixLogoVariant =
  | "navbar"
  | "hero"
  | "footer"
  | "auth"
  | "sidebar"
  | "loading";

/** Rendered width per placement. Height always follows the artwork's own ratio. */
const VARIANT_WIDTH_CLASS: Record<HrixLogoVariant, string> = {
  navbar: "w-[84px] md:w-[96px]",
  sidebar: "w-[84px]",
  footer: "w-[120px]",
  auth: "w-[150px] md:w-[176px]",
  hero: "w-[140px] sm:w-[176px] lg:w-[208px]",
  loading: "w-[168px]",
};

/** Largest width each variant can reach, used for the responsive `sizes` hint. */
const VARIANT_MAX_WIDTH: Record<HrixLogoVariant, number> = {
  navbar: 96,
  sidebar: 84,
  footer: 120,
  auth: 176,
  hero: 208,
  loading: 168,
};

export interface HrixLogoProps {
  variant?: HrixLogoVariant;
  /** Override the rendered width in px. Height stays proportional. */
  size?: number;
  className?: string;
  /** Set on the logo that is visible on first paint (navbar, hero, auth). */
  priority?: boolean;
  /** When set, the logo links to this URL and is labelled as a home link. */
  href?: string;
}

export function HrixLogo({
  variant = "navbar",
  size,
  className,
  priority = false,
  href,
}: HrixLogoProps) {
  const maxWidth = size ?? VARIANT_MAX_WIDTH[variant];

  const image = (
    <Image
      src={LOGO_SRC}
      alt={href ? "" : "HRIX"}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      draggable={false}
      sizes={`${maxWidth}px`}
      className="h-auto w-full select-none object-contain"
    />
  );

  const wrapperClass = cn(
    "relative inline-block shrink-0 leading-none",
    size === undefined && VARIANT_WIDTH_CLASS[variant],
    className,
  );
  const wrapperStyle = size !== undefined ? { width: size } : undefined;

  if (href) {
    return (
      <Link
        href={href}
        aria-label="HRIX home"
        className={wrapperClass}
        style={wrapperStyle}
      >
        {image}
      </Link>
    );
  }

  return (
    <span className={wrapperClass} style={wrapperStyle}>
      {image}
    </span>
  );
}
