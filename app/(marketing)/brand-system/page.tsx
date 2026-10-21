import type { Metadata } from "next";
import Link from "next/link";
import {
  Download,
  CheckCircle2,
  XCircle,
  Palette,
  Type,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { HrixLogo } from "@/components/brand/HrixLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/design/tokens";
import { ColorSwatchCard, AssetDownloadCard } from "@/components/brand/BrandSystemClient";

export const metadata: Metadata = {
  title: "Brand System",
  description:
    "Official HRIX brand guidelines, design tokens, logo usage, color palette, and typography system.",
};

const FOUNDATION_COLORS = [
  {
    name: "Canvas",
    token: "colors.canvas",
    hex: colors.canvas,
    border: true,
    description: "Primary deep page background for all views.",
  },
  {
    name: "Canvas Alt",
    token: "colors.canvasAlt",
    hex: colors.canvasAlt,
    border: true,
    description: "Alternating section fills, footer, and subtle depth layers.",
  },
  {
    name: "Surface",
    token: "colors.surface",
    hex: colors.surface,
    border: true,
    description: "Cards, panels, sidebars, and container elements.",
  },
  {
    name: "Surface Raised",
    token: "colors.surfaceRaised",
    hex: colors.surfaceRaised,
    border: true,
    description: "Hovered states, dropdown menus, and popovers.",
  },
  {
    name: "Line",
    token: "colors.line",
    hex: colors.line,
    border: true,
    description: "Hairline subtle dividers and translucent borders.",
  },
  {
    name: "Line Strong",
    token: "colors.lineStrong",
    hex: colors.lineStrong,
    border: true,
    description: "Input borders, active focus outlines, and strong boundaries.",
  },
];

const TEXT_COLORS = [
  {
    name: "Ink",
    token: "colors.ink",
    hex: colors.ink,
    textColor: "#050505",
    description: "Primary high-contrast white text for headlines and titles.",
  },
  {
    name: "Muted",
    token: "colors.muted",
    hex: colors.muted,
    textColor: "#050505",
    description: "Secondary text, paragraph copy, and descriptions.",
  },
  {
    name: "Faint",
    token: "colors.faint",
    hex: colors.faint,
    textColor: "#FFFFFF",
    description: "Metadata, placeholders, timestamps, and subtle hints.",
  },
];

const ACCENT_COLORS = [
  {
    name: "Electric Violet",
    token: "colors.violet",
    hex: colors.violet,
    textColor: "#FFFFFF",
    description: "Primary brand accent for focus glows, key buttons, and active items.",
  },
  {
    name: "Violet Soft",
    token: "colors.violetSoft",
    hex: colors.violetSoft,
    textColor: "#050505",
    description: "High-contrast text tint for violet badges and icons on dark canvas.",
  },
  {
    name: "Neon Blue",
    token: "colors.blue",
    hex: colors.blue,
    textColor: "#FFFFFF",
    description: "Secondary accent used for network links, metrics, and highlights.",
  },
  {
    name: "Blue Soft",
    token: "colors.blueSoft",
    hex: colors.blueSoft,
    textColor: "#050505",
    description: "High-contrast text tint for blue badges, tags, and data labels.",
  },
  {
    name: "Magenta",
    token: "colors.magenta",
    hex: colors.magenta,
    textColor: "#FFFFFF",
    description: "Dynamic accent for gradient sweeps, creator tiers, and badges.",
  },
  {
    name: "Magenta Soft",
    token: "colors.magentaSoft",
    hex: colors.magentaSoft,
    textColor: "#050505",
    description: "Soft tint for magenta badges and high-visibility accents.",
  },
];

const STATUS_COLORS = [
  {
    name: "Success",
    token: "colors.success",
    hex: colors.success,
    textColor: "#050505",
    description: "Verified badges, paid invoices, and successful operations.",
  },
  {
    name: "Warning",
    token: "colors.warning",
    hex: colors.warning,
    textColor: "#050505",
    description: "Pending verification, in-review milestones, and warnings.",
  },
  {
    name: "Danger",
    token: "colors.danger",
    hex: colors.danger,
    textColor: "#FFFFFF",
    description: "Action alerts, declined statuses, and destructive buttons.",
  },
];

const LOGO_VARIANTS = [
  {
    placement: "Navbar",
    width: "84px - 96px",
    usage: "Fixed site navigation header across desktop and mobile views.",
  },
  {
    placement: "Hero",
    width: "140px - 208px",
    usage: "Primary landing hero section and introductory brand statements.",
  },
  {
    placement: "Footer",
    width: "120px",
    usage: "Site footer baseline with high readability over dark background.",
  },
  {
    placement: "Auth & Modals",
    width: "150px - 176px",
    usage: "Centered login, registration, and onboarding header artwork.",
  },
  {
    placement: "Sidebar",
    width: "84px",
    usage: "Creator and Brand dashboard collapsible navigation rails.",
  },
  {
    placement: "Loading",
    width: "168px",
    usage: "Full-page loading and transition screens with gentle breathe animation.",
  },
];

export default function BrandSystemPage() {
  return (
    <div className="py-16 md:py-24">
      {/* Ambient background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.12),transparent)]" />
        <div className="absolute top-96 right-10 h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(79,124,255,0.08),transparent)]" />
      </div>

      <div className="container-page">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <Badge tone="violet" className="mb-4">
            <Sparkles className="h-3 w-3" />
            HRIX Design &amp; Brand System
          </Badge>
          <h1 className="text-display">Brand System</h1>
          <p className="mt-6 text-lg text-muted md:text-xl">
            The foundational visual language of HRIX — the Creator × Brand Growth Network.
            Engineered for precision, readability, and contrast across dark interfaces.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#logo" variant="secondary" size="sm">
              Logo &amp; Assets
            </Button>
            <Button href="#colors" variant="secondary" size="sm">
              Color Palette
            </Button>
            <Button href="#typography" variant="secondary" size="sm">
              Typography
            </Button>
            <Button href="#components" variant="secondary" size="sm">
              UI System
            </Button>
          </div>
        </div>

        {/* Section 1: Brand Principles */}
        <section className="mt-20 border-t border-line/70 pt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="neutral" className="mb-2">Foundations</Badge>
              <h2 className="text-headline">Brand Identity &amp; Voice</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Built to communicate trust, transparency, and high performance for both creators and enterprise brands.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <GlassCard tone="default" interactive>
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface-raised text-violet-soft">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">Quiet Precision</h3>
              <p className="mt-2 text-sm text-muted">
                A dark #050505 canvas provides low visual fatigue and allows creator media and portfolio assets to remain the hero. Chrome is kept minimal with clean 1px hairline dividers.
              </p>
            </GlassCard>

            <GlassCard tone="accent" interactive>
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface-raised text-blue-soft">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">Electric Clarity</h3>
              <p className="mt-2 text-sm text-muted">
                High-chroma violet (#8B5CF6) and neon blue (#4F7CFF) accents guide attention toward actions, interactive network nodes, and match scores without visual clutter.
              </p>
            </GlassCard>

            <GlassCard tone="default" interactive>
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface-raised text-success">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">Verifiable Trust</h3>
              <p className="mt-2 text-sm text-muted">
                Every metric, identity state, and payout milestone is rendered with clear semantic badges, transparent statuses, and structured metadata.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Section 2: Logo System */}
        <section id="logo" className="mt-24 border-t border-line/70 pt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="violet" className="mb-2">Visual Assets</Badge>
              <h2 className="text-headline">Logo &amp; Mark Guidelines</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              The official HRIX logo is rendered exclusively from verified brand assets. Never recreate the mark in plain text or distort its geometry.
            </p>
          </div>

          {/* Logo Showcase Hero */}
          <div className="mt-10 rounded-xl border border-line bg-surface/70 p-8 backdrop-blur-md md:p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="py-8">
                <HrixLogo variant="hero" priority />
              </div>
              <p className="mt-4 max-w-lg text-sm text-muted">
                The primary HRIX wordmark combines a dynamic stylized emblem with precise, bold lettering.
              </p>
            </div>
          </div>

          {/* Downloadable Assets */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <AssetDownloadCard
              title="Official HRIX Wordmark"
              description="Primary brand logo for light and dark placements."
              dimensions="366 × 130 px"
              format="PNG"
              fileSize="27.4 KB"
              src="/brand/hrix-logo.png"
              fileName="hrix-logo.png"
              aspectRatio="366/130"
            />
            <AssetDownloadCard
              title="HRIX Emblem Mark"
              description="Compact mark for social avatars, favicons and badges."
              dimensions="128 × 128 px"
              format="PNG"
              fileSize="6.9 KB"
              src="/brand/hrix-mark.png"
              fileName="hrix-mark.png"
              aspectRatio="1/1"
            />
          </div>

          {/* Sizing Specifications Table */}
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-ink">Variant Sizing Rules</h3>
            <p className="mt-1 text-sm text-muted">
              Use standard component variants defined in <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-ink font-mono">HrixLogo.tsx</code> to maintain visual proportion across devices.
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-surface-raised/70 text-xs uppercase font-mono text-faint">
                    <tr>
                      <th className="px-5 py-3.5">Variant</th>
                      <th className="px-5 py-3.5">Rendered Width</th>
                      <th className="px-5 py-3.5">Context &amp; Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60 text-muted">
                    {LOGO_VARIANTS.map((row) => (
                      <tr key={row.placement} className="hover:bg-white/[0.02]">
                        <td className="px-5 py-3.5 font-medium text-ink font-mono">{row.placement}</td>
                        <td className="px-5 py-3.5 font-mono text-violet-soft">{row.width}</td>
                        <td className="px-5 py-3.5">{row.usage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dos & Don'ts */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <GlassCard tone="default" className="border-success/30 bg-success/[0.02]">
              <div className="flex items-center gap-2 text-success font-display font-semibold">
                <CheckCircle2 className="h-5 w-5" />
                <span>Usage Dos</span>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Always display on dark backgrounds (#050505 canvas or #111118 surface).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Maintain clear space around the logo equal to at least half the emblem height.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  Use the official SVG/PNG artwork assets without altering proportions.
                </li>
              </ul>
            </GlassCard>

            <GlassCard tone="default" className="border-danger/30 bg-danger/[0.02]">
              <div className="flex items-center gap-2 text-danger font-display font-semibold">
                <XCircle className="h-5 w-5" />
                <span>Usage Don&apos;ts</span>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-danger">✕</span>
                  Do not recreate the mark using system fonts or plain typography.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger">✕</span>
                  Do not alter colors, skew, stretch, rotate, or add drop-shadow filters.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger">✕</span>
                  Do not place the logo inside high-contrast solid light boxes.
                </li>
              </ul>
            </GlassCard>
          </div>
        </section>

        {/* Section 3: Color System */}
        <section id="colors" className="mt-24 border-t border-line/70 pt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="blue" className="mb-2">Color Palette</Badge>
              <h2 className="text-headline">Color System &amp; Tokens</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Click any swatch below to copy its HEX color value directly to your clipboard. All tokens are exported from <code className="rounded bg-surface px-1.5 py-0.5 text-xs text-ink font-mono">tokens.ts</code>.
            </p>
          </div>

          <div className="mt-10 space-y-10">
            {/* Foundation */}
            <div>
              <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet" />
                Canvas &amp; Surfaces
              </h3>
              <p className="text-xs text-muted mt-1">Deep background levels that structure spatial depth.</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {FOUNDATION_COLORS.map((c) => (
                  <ColorSwatchCard key={c.name} color={c} />
                ))}
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-ink" />
                Typography &amp; Text Levels
              </h3>
              <p className="text-xs text-muted mt-1">Calibrated white and neutral tones for optimal contrast ratios.</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {TEXT_COLORS.map((c) => (
                  <ColorSwatchCard key={c.name} color={c} />
                ))}
              </div>
            </div>

            {/* Electric Accents */}
            <div>
              <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue" />
                Electric Brand Accents
              </h3>
              <p className="text-xs text-muted mt-1">High-vibrancy accents paired with soft text tints for WCAG AA contrast.</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {ACCENT_COLORS.map((c) => (
                  <ColorSwatchCard key={c.name} color={c} />
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                Semantic &amp; Status Colors
              </h3>
              <p className="text-xs text-muted mt-1">Clear indicators for verified states, approvals, and system notifications.</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {STATUS_COLORS.map((c) => (
                  <ColorSwatchCard key={c.name} color={c} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Typography */}
        <section id="typography" className="mt-24 border-t border-line/70 pt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="violet" className="mb-2">Type Scale</Badge>
              <h2 className="text-headline">Typography System</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Dual font pairing optimized for editorial character and computational precision.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <GlassCard tone="default">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Bricolage Grotesque</h3>
                  <p className="text-xs text-muted font-mono mt-0.5">var(--font-display)</p>
                </div>
                <Badge tone="violet">Headings &amp; Display</Badge>
              </div>
              <p className="mt-4 text-sm text-muted">
                A character-rich variable font with a width axis. Loaded condensed and heavy for memorable headlines with tight letter spacing.
              </p>
              <div className="mt-6 space-y-4 rounded-md border border-line bg-canvas p-5">
                <div>
                  <span className="text-[10px] uppercase font-mono text-faint">Display (text-display)</span>
                  <div className="text-display mt-1 text-ink">CREATOR NETWORK</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-faint">Headline (text-headline)</span>
                  <div className="text-headline mt-1 text-ink">Precision Brand Matching</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-faint">Title (text-title)</span>
                  <div className="text-title mt-1 text-ink">Verified Creator Portfolio</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard tone="default">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">Instrument Sans</h3>
                  <p className="text-xs text-muted font-mono mt-0.5">var(--font-body)</p>
                </div>
                <Badge tone="blue">Interface &amp; Body</Badge>
              </div>
              <p className="mt-4 text-sm text-muted">
                A balanced modernist grotesque designed for clean legibility on high-density displays. Powers all UI controls, data tables, and body paragraphs.
              </p>
              <div className="mt-6 space-y-4 rounded-md border border-line bg-canvas p-5">
                <div>
                  <span className="text-[10px] uppercase font-mono text-faint">Body Text (1rem / 16px)</span>
                  <p className="mt-1 text-sm text-muted">
                    HRIX connects creators with brands through a secure, vetted marketplace with automated deliverables and guaranteed payouts.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-faint">Label &amp; Controls (text-label)</span>
                  <div className="text-label mt-1 text-ink font-medium">Filter by category, city, or engagement rate</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-faint">Metadata &amp; Footnotes (text-faint)</span>
                  <div className="text-xs text-faint mt-1">Creator membership starting from ₹99/month. All rights reserved.</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Section 5: UI System & Components */}
        <section id="components" className="mt-24 border-t border-line/70 pt-16">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge tone="violet" className="mb-2">Components</Badge>
              <h2 className="text-headline">Interface System Showcase</h2>
            </div>
            <p className="max-w-md text-sm text-muted">
              Interactive UI primitives designed with glassmorphism, subtle glows, and accessible contrast.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {/* Glass Card Tones */}
            <div>
              <h3 className="font-display text-base font-semibold text-ink">GlassCard Surfaces</h3>
              <p className="text-xs text-muted mt-0.5">Three distinct surface elevations built with backdrop-blur.</p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <GlassCard tone="default">
                  <span className="text-xs font-mono text-violet-soft">tone=&quot;default&quot;</span>
                  <p className="mt-2 text-sm text-muted">
                    Resting cards and secondary containers with subtle 1px line border.
                  </p>
                </GlassCard>

                <GlassCard tone="raised">
                  <span className="text-xs font-mono text-blue-soft">tone=&quot;raised&quot;</span>
                  <p className="mt-2 text-sm text-muted">
                    Elevated surface for popovers, drawers, and active hover cards.
                  </p>
                </GlassCard>

                <GlassCard tone="accent">
                  <span className="text-xs font-mono text-magenta-soft">tone=&quot;accent&quot;</span>
                  <p className="mt-2 text-sm text-muted">
                    Featured surface featuring a top hairline violet light sweep.
                  </p>
                </GlassCard>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="font-display text-base font-semibold text-ink">Badge Tones</h3>
              <p className="text-xs text-muted mt-0.5">Semantic status chips with matching border and background tints.</p>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <Badge tone="neutral">Neutral Badge</Badge>
                <Badge tone="violet">Violet Accent</Badge>
                <Badge tone="blue">Blue Network</Badge>
                <Badge tone="success">Verified State</Badge>
                <Badge tone="warning">Pending Review</Badge>
                <Badge tone="danger">Payment Failed</Badge>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <h3 className="font-display text-base font-semibold text-ink">Button Styles</h3>
              <p className="text-xs text-muted mt-0.5">Consistent button hierarchy with smooth hover and focus states.</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Next Steps / Navigation CTA */}
        <section className="mt-24 rounded-2xl border border-line bg-gradient-to-b from-surface/80 to-surface-raised/40 p-8 text-center backdrop-blur-md md:p-14">
          <Badge tone="violet" className="mx-auto mb-4">Explore HRIX</Badge>
          <h2 className="text-headline mx-auto max-w-xl">Ready to collaborate on HRIX?</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted md:text-base">
            Discover verified creators, launch high-impact campaigns, and grow your presence across the network.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/creators" size="lg">
              Explore Creators
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/brands" variant="secondary" size="lg">
              Brand Solutions
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
