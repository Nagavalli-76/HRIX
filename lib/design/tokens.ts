/**
 * HRIX design tokens — the single source of truth.
 *
 * tailwind.config.ts reads from this file, and 3D scenes / charts can import it
 * directly, so a colour is never typed twice. Change a value here and the whole
 * product follows.
 */

export const colors = {
  /** Page background. */
  canvas: "#050505",
  /** Alternate section background. */
  canvasAlt: "#0A0A0F",
  /** Cards, panels, sidebars. */
  surface: "#111118",
  /** Raised surfaces: menus, popovers, hovered cards. */
  surfaceRaised: "#15151D",
  /** Hairline borders on dark surfaces. */
  line: "#24242F",
  lineStrong: "#34344A",

  /** Soft white — primary text. */
  ink: "#F2F2F7",
  /** Secondary text. */
  muted: "#A0A0B2",
  /** Metadata, placeholders. */
  faint: "#6E6E82",

  /** Accents: used for focus, selection, charts and light — never as page fill. */
  violet: "#8B5CF6",
  blue: "#4F7CFF",
  magenta: "#E04FBF",
  /** Lighter tints of the accents, for text and icons on dark surfaces (AA contrast). */
  violetSoft: "#BBA4FF",
  blueSoft: "#93AEFF",
  magentaSoft: "#F08FD8",

  /** Status colours for badges, collaboration states and payments. */
  success: "#3DD68C",
  warning: "#F2B84B",
  danger: "#F26D78",
} as const;

export const radii = {
  /** Badges, small controls. */
  sm: "6px",
  /** Buttons, inputs. */
  md: "10px",
  /** Cards, panels. */
  lg: "16px",
  /** Hero panels, modals. */
  xl: "24px",
} as const;

export const shadows = {
  /** Resting panel on the dark canvas. */
  panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -12px rgba(0,0,0,0.7)",
  /** Menus and drawers that sit above content. */
  overlay: "0 24px 64px -16px rgba(0,0,0,0.85)",
  /** Quiet accent light. Use on at most one element per view. */
  glowViolet: "0 0 48px -8px rgba(139,92,246,0.45)",
  glowBlue: "0 0 48px -8px rgba(79,124,255,0.4)",
} as const;

export const typography = {
  /** Display / headings. Loaded in app/layout.tsx as --font-display. */
  display: "var(--font-display)",
  /** Body and UI. Loaded in app/layout.tsx as --font-body. */
  body: "var(--font-body)",
} as const;

/** The accent sweep used for network lines, charts and progress fills. */
export const accentGradient = `linear-gradient(90deg, ${colors.violet}, ${colors.blue})`;

/** Fixed layout measures. */
export const layout = {
  maxWidth: "1240px",
  navHeight: "68px",
} as const;

export type ColorToken = keyof typeof colors;
