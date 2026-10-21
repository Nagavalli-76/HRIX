import type { Config } from "tailwindcss";
import { colors, radii, shadows, layout } from "./lib/design/tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: colors.canvas, alt: colors.canvasAlt },
        surface: { DEFAULT: colors.surface, raised: colors.surfaceRaised },
        line: { DEFAULT: colors.line, strong: colors.lineStrong },
        ink: colors.ink,
        muted: colors.muted,
        faint: colors.faint,
        violet: { DEFAULT: colors.violet, soft: colors.violetSoft },
        blue: { DEFAULT: colors.blue, soft: colors.blueSoft },
        magenta: { DEFAULT: colors.magenta, soft: colors.magentaSoft },
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
      },
      borderRadius: {
        sm: radii.sm,
        md: radii.md,
        lg: radii.lg,
        xl: radii.xl,
      },
      boxShadow: {
        panel: shadows.panel,
        overlay: shadows.overlay,
        "glow-violet": shadows.glowViolet,
        "glow-blue": shadows.glowBlue,
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: layout.maxWidth,
      },
      height: {
        nav: layout.navHeight,
      },
      keyframes: {
        "hub-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "hub-spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
        "loader-slide": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(300%)" },
        },
        "logo-breathe": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "hub-spin": "hub-spin 60s linear infinite",
        "hub-spin-reverse": "hub-spin-reverse 90s linear infinite",
        "logo-breathe": "logo-breathe 2.4s ease-in-out infinite",
        "loader-slide": "loader-slide 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
