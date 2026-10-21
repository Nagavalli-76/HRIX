# HRIX — Creator × Brand Growth Network

> **Live Website:** [https://hrixofficial.in](https://hrixofficial.in)  
> **GitHub Repository:** [https://github.com/Nagavalli-76/HRIX](https://github.com/Nagavalli-76/HRIX)  
> **Deployed on:** [Vercel](https://vercel.com)  
> **Database:** [Supabase](https://supabase.com)

---

## What is HRIX?

**HRIX** is a Creator × Brand Growth Network — a platform that connects content creators and brands in a structured, professional environment. Unlike follower-count-based platforms, HRIX focuses on:

- **Profile-first discovery** — every creator builds a professional profile with platforms, audience, niche, and rate card
- **Structured brand partnerships** — brands discover, shortlist, pitch, and manage creators from a single dashboard
- **No inflated numbers** — real data, real collaboration, real results

### For Creators
- Register and build a professional creator profile
- Get discovered by verified brands
- Apply to campaigns that match your audience and category
- Track earnings, collaborations, and deliverables in one dashboard
- Optional profile audit and growth roadmap services

### For Brands
- Register and get verified as a brand on HRIX
- Access a directory of real, registered creators filtered by category, city, platform and engagement
- Launch campaigns, shortlist creators, manage deliverables and payments
- Verified brand badge and direct messaging with creators

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org) — App Router, Server Components, Server Actions |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org) — strict mode |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com) — custom design system tokens |
| **Animations** | [Framer Motion 12](https://www.framer-motion.com) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Database** | [Supabase](https://supabase.com) — PostgreSQL with Row-Level Security |
| **Auth** | Supabase Auth — email/password with role-based middleware |
| **Email** | [Resend](https://resend.com) — transactional emails |
| **Deployment** | [Vercel](https://vercel.com) — auto-deploy on push to `main` |
| **Package Manager** | npm |

---

## Project Structure

```
hrix2/
├── app/                          # Next.js App Router routes
│   ├── (marketing)/              # Public site (no auth required)
│   │   ├── page.tsx              # Homepage
│   │   ├── creators/             # Creator directory (brand access only)
│   │   ├── brands/               # Brand listings
│   │   ├── campaigns/            # Campaign listings
│   │   ├── how-it-works/         # How HRIX works
│   │   ├── pricing/              # Creator membership pricing
│   │   ├── about/                # About HRIX
│   │   └── brand-system/         # Brand identity guide
│   ├── (auth)/                   # Auth pages (login, register, etc.)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── update-password/
│   ├── creator/                  # Creator-only routes (role-gated)
│   │   ├── onboarding/           # 10-step creator onboarding
│   │   └── dashboard/            # Creator dashboard
│   │       ├── page.tsx          # Overview
│   │       ├── campaigns/        # Discover campaigns
│   │       ├── applications/     # My applications
│   │       ├── collaborations/   # Active collaborations
│   │       ├── messages/         # Messaging
│   │       ├── portfolio/        # Portfolio manager
│   │       ├── earnings/         # Earnings tracker
│   │       ├── subscription/     # Membership management
│   │       ├── profile/          # Profile editor
│   │       └── settings/         # Account settings
│   ├── brand/                    # Brand-only routes (role-gated)
│   │   ├── onboarding/           # 3-step brand onboarding
│   │   └── dashboard/            # Brand dashboard
│   │       ├── page.tsx          # Overview
│   │       ├── creators/         # Creator discovery
│   │       ├── campaigns/        # Campaign management
│   │       ├── applications/     # Review applications
│   │       ├── shortlisted/      # Shortlisted creators
│   │       ├── collaborations/   # Collaboration tracking
│   │       ├── messages/         # Messaging
│   │       ├── analytics/        # Campaign analytics
│   │       ├── payments/         # Payments
│   │       ├── profile/          # Brand profile
│   │       └── settings/         # Account settings
│   ├── admin/                    # Admin-only routes (role-gated)
│   │   ├── page.tsx              # Admin overview
│   │   ├── creators/             # Manage all creators
│   │   ├── brands/               # Manage all brands
│   │   ├── campaigns/            # Manage all campaigns
│   │   ├── applications/         # Review applications
│   │   ├── verification/         # Brand verification queue
│   │   ├── payments/             # Payment records
│   │   ├── reports/              # Platform reports
│   │   └── settings/             # Platform settings
│   ├── api/                      # API Routes
│   │   ├── creators/             # Creator API (public list + slug lookup)
│   │   └── payments/webhook/     # Payment webhook handler
│   └── auth/callback/            # Supabase auth callback
│
├── components/
│   ├── ui/                       # Design system primitives
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── EmptyState.tsx
│   │   ├── GlassCard.tsx
│   │   ├── Input.tsx / Textarea.tsx / Select.tsx
│   │   ├── LoadingState.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatCard.tsx
│   │   └── TrustBadge.tsx
│   ├── marketing/                # Homepage and marketing sections
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HeroNetwork.tsx       # Animated SVG creator-brand network
│   │   ├── TrustMetrics.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── PricingTiers.tsx
│   │   ├── CreatorCard.tsx
│   │   ├── BrandCard.tsx
│   │   ├── CampaignCard.tsx
│   │   └── previews/             # Illustrative UI mockups for homepage
│   ├── brand/                    # Brand-specific components
│   │   ├── BrandProfileForm.tsx
│   │   ├── CampaignForm.tsx
│   │   ├── LockedCreatorDirectory.tsx
│   │   └── BrandAccessSubscribeButton.tsx
│   ├── creator/                  # Creator-specific components
│   │   ├── CreatorProfileForm.tsx
│   │   ├── ApplyForm.tsx
│   │   └── CreatorMembershipManager.tsx
│   ├── dashboard/                # Shared dashboard chrome
│   │   ├── Sidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── MessagingPanel.tsx
│   │   ├── NotificationsPopover.tsx
│   │   └── CollaborationTimeline.tsx
│   └── admin/
│       └── ModerationButton.tsx
│
├── features/
│   └── onboarding/               # Multi-step onboarding flows
│       ├── CreatorOnboarding.tsx  # 10-step creator registration
│       ├── BrandOnboarding.tsx    # 3-step brand registration
│       └── RoleSelector.tsx      # Role picker on /register
│
├── lib/
│   ├── api/                      # Server-side data access layer
│   │   ├── creators.ts           # Creator profile queries (RLS-enforced)
│   │   ├── brands.ts
│   │   ├── campaigns.ts
│   │   ├── applications.ts
│   │   ├── collaborations.ts
│   │   ├── messages.ts
│   │   ├── payments.ts
│   │   ├── analytics.ts
│   │   ├── notifications.ts
│   │   └── brand-access.ts       # Brand directory access status check
│   ├── actions/                  # Next.js Server Actions
│   │   ├── auth.ts
│   │   ├── onboarding.ts
│   │   ├── profiles.ts
│   │   ├── campaigns.ts
│   │   ├── applications.ts
│   │   ├── brand-access.ts
│   │   ├── creator-membership.ts
│   │   ├── messages.ts
│   │   ├── moderation.ts
│   │   ├── notifications.ts
│   │   └── verification.ts
│   ├── supabase/                 # Supabase client setup
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server component client
│   │   ├── middleware.ts         # Session refresh in middleware
│   │   └── admin.ts              # Service-role client (server-only)
│   ├── design/tokens.ts          # Single source of truth for all design tokens
│   ├── navigation.ts             # Shared nav link definitions
│   ├── dashboard-nav.ts          # Dashboard sidebar nav items
│   ├── format.ts                 # Number/date formatting utilities
│   ├── email.ts                  # Resend email helper
│   └── cn.ts                     # Tailwind class merge utility
│
├── data/                         # Static pricing/config data
│   └── pricing.ts                # All membership plan definitions
│
├── types/
│   ├── index.ts                  # Shared domain types
│   └── database.ts               # Supabase schema types
│
├── supabase/
│   └── migrations/               # SQL migrations (apply in Supabase SQL editor)
│       ├── 20260925000000_init_schema.sql
│       ├── 20260928000000_production_hardening.sql
│       ├── 20260928100000_workflow_hardening.sql
│       ├── 20260928110000_storage_policy_hardening.sql
│       ├── 20260928130000_message_read_policy.sql
│       ├── 20261019_brand_directory_access_and_pricing.sql
│       └── 20261021000000_stage4_annual_pricing_paid_brand_access.sql
│
├── public/
│   └── brand/                    # Official HRIX logo assets
│       ├── hrix-logo.png         # Full wordmark
│       ├── hrix-logo-source.png  # Original source artwork
│       └── hrix-mark.png         # "H" glyph — used in hero network + favicon
│
├── middleware.ts                  # Auth + role-based route guard
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Authentication & Authorization

HRIX uses **Supabase Auth** with a custom role system enforced at three layers:

### Roles
| Role | Access |
|------|--------|
| `creator` | Creator dashboard, own profile, campaigns |
| `brand` | Brand dashboard, creator directory (paid + verified only) |
| `admin` | Full platform access, moderation queue, all data |

### Route Guards (middleware.ts)
- Unauthenticated users → redirected to `/login` for protected routes
- Authenticated users on auth pages → redirected to their dashboard
- Cross-role access → redirected to correct dashboard (e.g., creator hitting `/brand/…`)

### Creator Directory Access Control
Creator profiles are protected at **two levels**:
1. **Server-side** — `getBrandDirectoryAccessStatus()` checks role, brand verification (`trust = 'verified-brand'`), and active paid subscription before any data is fetched
2. **Database RLS** — Supabase Row-Level Security policies (`has_brand_directory_access()` function) enforce the same rules at query time — even if the server check is bypassed

---

## Membership & Pricing

### Creator Plans

| Plan | Price | Duration | Type |
|------|-------|----------|------|
| HRIX Entry | ₹99/month | 30 days | Registration |
| Profile Audit | ₹499/year | 12 months | Service |
| Creator Growth | ₹999/year | 12 months | Service |

### Brand Plan

| Plan | Price | Duration | Requirement |
|------|-------|----------|-------------|
| Brand Directory Access | ₹2,999/month | 30 days | Verified brand only |

All plans are defined in [`data/pricing.ts`](./data/pricing.ts) — the single source of truth used across onboarding, the homepage, pricing page, and dashboards.

---

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- npm
- A [Supabase](https://supabase.com) project (free tier works)
- A [Resend](https://resend.com) account for email (optional for local dev)

### 1. Clone the repository

```bash
git clone https://github.com/Nagavalli-76/HRIX.git
cd HRIX
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Public Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase — get these from your Supabase project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side only — NEVER expose to client
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Email (Resend) — server-side only
RESEND_API_KEY=re_your-api-key-here
```

> ⚠️ **Never commit `.env.local`** — it is already in `.gitignore`

### 4. Set up the Supabase database

Apply all migrations **in order** via your Supabase SQL Editor  
(`https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new`):

```
supabase/migrations/20260925000000_init_schema.sql
supabase/migrations/20260928000000_production_hardening.sql
supabase/migrations/20260928100000_workflow_hardening.sql
supabase/migrations/20260928110000_storage_policy_hardening.sql
supabase/migrations/20260928130000_message_read_policy.sql
supabase/migrations/20261019_brand_directory_access_and_pricing.sql
supabase/migrations/20261021000000_stage4_annual_pricing_paid_brand_access.sql
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server locally
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type check (tsc --noEmit)
```

---

## Deployment

The project is deployed on **Vercel** and automatically deploys on every push to the `main` branch via the GitHub integration.

**Live URL:** [https://hrixofficial.in](https://hrixofficial.in)

### Required Vercel Environment Variables

Set these in your Vercel project → **Settings → Environment Variables**:

| Variable | Visibility | Description |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Public | `https://hrixofficial.in` |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Supabase service role key — server only |
| `RESEND_API_KEY` | **Secret** | Resend API key for transactional emails |

> ⚠️ **`SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` must never be prefixed with `NEXT_PUBLIC_`** — they would be exposed to the browser.

---

## Design System

All visual tokens are defined in [`lib/design/tokens.ts`](./lib/design/tokens.ts) and consumed by both Tailwind and runtime SVG/canvas code.

### Color Palette
| Token | Use |
|-------|-----|
| `canvas` / `canvas-alt` | Page and card backgrounds |
| `surface` / `surface-raised` | Elevated panels |
| `ink` | Primary text |
| `muted` / `faint` | Secondary and tertiary text |
| `violet` / `violet-soft` | Primary accent (creators) |
| `blue` / `blue-soft` | Secondary accent (brands) |
| `success` / `warning` / `danger` | Status colours |

### Typography
- **Display font** — `var(--font-display)` — used for headings
- **Body font** — `var(--font-body)` — used for all body text

### Key Components
- `GlassCard` — frosted glass panel with configurable tone
- `Button` — primary, secondary, ghost, danger variants
- `Badge` — neutral, violet, warning, danger tones
- `Avatar` — initials-based avatar with consistent colour generation
- `TrustBadge` — creator/brand trust state indicator
- `EmptyState` — consistent empty/zero-data presentation
- `LoadingState` — skeleton loading indicator

---

## Database Schema (Overview)

| Table | Description |
|-------|-------------|
| `profiles` | Base user record — role (`creator` / `brand` / `admin`), status |
| `creator_profiles` | Creator-specific profile — category, city, bio, rate, trust state |
| `brand_profiles` | Brand-specific profile — brand name, slug, verification trust state |
| `social_accounts` | Creator social media accounts — platform, handle, followers, engagement |
| `portfolio_items` | Creator portfolio entries |
| `campaigns` | Brand-created campaigns — title, brief, budget, deliverables |
| `applications` | Creator applications to campaigns |
| `collaborations` | Confirmed creator–brand engagements |
| `messages` | In-platform messaging between creators and brands |
| `notifications` | Platform notifications |
| `user_subscriptions` | Active membership/service subscriptions |
| `subscription_plans` | Plan catalog (entry, profile-audit, creator-growth, brand-directory-access) |
| `payments` | Payment records linked to subscriptions |

---

## Security Notes

- **RLS is enabled** on all sensitive tables — creator profiles, social accounts, and portfolio items are only readable by verified paying brands, admins, or the creator themselves
- **Service-role key** is only used server-side (API routes, Server Actions, admin functions) — never passed to the client
- **Middleware** enforces role-based route access at the edge before any page renders
- **No demo/seed data** is inserted into production — all creator and brand records are real registered users
- **`.env.local` is gitignored** — secrets are never committed to version control

---

## Contributing

This is a private production project. If you have access to this repository:

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run typecheck` and `npm run build` locally before pushing
4. Open a pull request to `main` — Vercel will create a preview deployment automatically

---

## Links

| Resource | URL |
|----------|-----|
| 🌐 Live website | [https://hrixofficial.in](https://hrixofficial.in) |
| 💻 GitHub repository | [https://github.com/Nagavalli-76/HRIX](https://github.com/Nagavalli-76/HRIX) |
| ▲ Vercel dashboard | [https://vercel.com/dashboard](https://vercel.com/dashboard) |
| 🗄️ Supabase dashboard | [https://supabase.com/dashboard](https://supabase.com/dashboard) |
| 📧 Resend dashboard | [https://resend.com/overview](https://resend.com/overview) |

---

## License

Private — All rights reserved. © 2026 HRIX.
