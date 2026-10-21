# HRIX — Frontend

Frontend-first implementation of HRIX, the Creator × Brand Growth Network.
Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
and Lucide icons. No backend is wired up yet — all data comes from the
mock layer in `lib/api/*`, which is written to the interface a real
MongoDB/Supabase backend should implement.

## Getting started

This project was generated in a sandbox without registry access, so
dependencies have not been installed here. On a machine with normal
network access:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

```
app/                    Routes (App Router)
  (marketing)/          Public site: home, creators, campaigns, brands, etc.
  (auth)/               Login, register, forgot password
  creator/              Creator onboarding + dashboard
  brand/                Brand onboarding + dashboard
  admin/                Admin dashboard
components/
  brand/HrixLogo.tsx    The official logo component — never edit the artwork
  ui/                   Design-system primitives (Button, GlassCard, etc.)
  marketing/            Public-site sections and cards
  dashboard/            Sidebar, header, messaging, collaboration timeline
features/onboarding/    Multi-step onboarding flows
lib/
  api/                  Mock-data service layer (swap for real API calls later)
  design/tokens.ts       Single source of truth for colour/spacing/shadow tokens
data/                   Mock creators, brands, campaigns
types/                  Shared domain types
public/brand/           Official HRIX logo assets + derived favicon/app icons
```

## Brand assets

`public/brand/hrix-logo.png` is the official logo, trimmed to its visible
bounds. `public/brand/hrix-mark.png` is the "H" glyph on its own, used in
the hero network illustration and as the base for `app/icon.png`,
`app/apple-icon.png` and `app/favicon.ico`. None of these recreate the
wordmark — they're crops/derivatives of the supplied artwork.

## What's built

- Brand system: design tokens, `HrixLogo`, UI primitives
- Marketing site: home, how-it-works, pricing, about, creator/campaign/brand
  marketplaces and detail pages
- Auth: login, forgot password, register with role selection
- Creator onboarding (10 steps) and brand onboarding (3 steps)
- Creator dashboard: overview, discover campaigns, applications,
  collaborations (status timeline), messages, portfolio, earnings,
  subscription, profile, settings
- Brand dashboard: overview, campaigns, discover creators, applications,
  shortlisted, collaborations, messages, analytics, payments, profile,
  settings
- Admin dashboard: overview, creators, brands, campaigns, applications,
  payments, verification queue, reports, settings
- Global error boundary, 404 page, branded loading state, robots.ts,
  sitemap.ts

## Known gaps / next steps

- **Not yet verified to build.** This sandbox has no network access, so
  `npm install` / `npm run build` / `tsc --noEmit` have not been run
  against this code. Run those first on a connected machine and fix
  whatever surfaces — the code was written carefully but hasn't compiled.
- No real auth, payments, or messaging backend — all mock data.
- No automated tests yet.
- The React Three Fiber hero scene described in the original brief was
  built instead as a lightweight animated SVG (`HeroNetwork.tsx`), which
  doubles as the non-WebGL fallback. A true R3F scene can replace it
  behind the same component boundary if you want the extra depth.
