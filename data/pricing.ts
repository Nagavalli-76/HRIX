export type PlanType = "registration" | "service" | "brand-access";

export interface CreatorPlan {
  id: "entry" | "profile-audit" | "creator-growth";
  name: string;
  tagline: string;
  price: number;
  type: PlanType;
  billingPeriod: string;
  renewalNote: string;
  validityDuration: string;
  durationDays: number;
  badge?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface BrandPlan {
  id: "brand-directory-access";
  name: string;
  tagline: string;
  price: number;
  type: "brand-access";
  billingPeriod: string;
  renewalNote: string;
  validityDuration: string;
  durationDays: number;
  badge?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Single source of truth for HRIX membership and service pricing. Every
 * pricing surface (homepage, pricing page, onboarding, admin, checkout) reads from
 * this file so ₹99/month, ₹499/year, and ₹999/year stay consistent everywhere.
 */
export const creatorPlans: CreatorPlan[] = [
  {
    id: "entry",
    name: "HRIX Entry",
    tagline: "Register and set up your creator profile.",
    price: 99,
    type: "registration",
    billingPeriod: "/month",
    renewalNote: "Monthly membership · 30 days validity · Manual renewal upon expiration",
    validityDuration: "30 days",
    durationDays: 30,
    features: [
      "HRIX creator registration",
      "Creator profile setup",
      "Creator profile visibility",
      "Access to the HRIX creator ecosystem",
      "Profile completion tracking",
      "Basic opportunity access when available",
      "Creator dashboard",
    ],
    ctaLabel: "Register for ₹99/month",
    ctaHref: "/register?role=creator&plan=entry",
  },
  {
    id: "profile-audit",
    name: "Profile Audit",
    tagline: "Get a personalized review of your creator profile.",
    price: 499,
    type: "service",
    billingPeriod: "/year",
    renewalNote: "Annual subscription · Valid for 12 months · Manual renewal upon expiration",
    validityDuration: "12 months (Annual)",
    durationDays: 365,
    features: [
      "Personal profile audit",
      "Content/profile presentation review",
      "Bio optimization suggestions",
      "Profile positioning suggestions",
      "Portfolio improvement suggestions",
      "Platform presence review",
      "Audience presentation review",
      "Personalized checklist",
      "Actionable recommendations",
    ],
    ctaLabel: "Personal Audit — ₹499/year",
    ctaHref: "/register?role=creator&plan=profile-audit",
  },
  {
    id: "creator-growth",
    name: "Creator Growth",
    tagline: "Turn your profile into a brand-ready creator presence.",
    price: 999,
    type: "service",
    billingPeriod: "/year",
    renewalNote: "Annual subscription · Valid for 12 months · Manual renewal upon expiration",
    validityDuration: "12 months (Annual)",
    durationDays: 365,
    badge: "Complete Creator Package",
    features: [
      "Everything in Profile Audit",
      "Complete profile positioning review",
      "Personal creator positioning strategy",
      "Content direction suggestions",
      "Portfolio restructuring recommendations",
      "Brand-readiness checklist",
      "Personalized creator growth roadmap",
      "Recommended next steps",
      "One structured strategy report",
    ],
    ctaLabel: "Growth Plan — ₹999/year",
    ctaHref: "/register?role=creator&plan=creator-growth",
  },
];

export const brandPlans: BrandPlan[] = [
  {
    id: "brand-directory-access",
    name: "Brand Directory Access",
    tagline: "Verified creator discovery and direct outreach for brands.",
    price: 2999,
    type: "brand-access",
    billingPeriod: "/month",
    renewalNote: "Monthly membership · 30 days validity · Manual renewal upon expiration",
    validityDuration: "30 days",
    durationDays: 30,
    badge: "Verified Brands",
    features: [
      "Full verified creator directory access",
      "Filter by category, city, and engagement",
      "View full creator portfolios & audience metrics",
      "Direct creator messaging & communication",
      "Campaign pitching & collaboration management",
      "Verified brand badge",
    ],
    ctaLabel: "Subscribe for ₹2,999/month",
    ctaHref: "/brand/dashboard/creators",
  },
];

export function getCreatorPlan(id: CreatorPlan["id"]) {
  return creatorPlans.find((plan) => plan.id === id);
}

export function getBrandPlan(id: BrandPlan["id"] = "brand-directory-access") {
  return brandPlans.find((plan) => plan.id === id);
}
