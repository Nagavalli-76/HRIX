export interface NavItem {
  label: string;
  href: string;
}

/** Public website navigation. Shared by the navbar, mobile menu and footer. */
export const primaryNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Creators", href: "/creators" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "For Brands", href: "/brands" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

export const servicesNav: NavItem[] = [
  { label: "Branding & Identity", href: "/services/branding-and-identity" },
  { label: "Influencer Marketing", href: "/services/influencer-marketing" },
  { label: "Digital Marketing & Ads", href: "/services/digital-marketing-advertising" },
  { label: "Social Media Marketing", href: "/services/social-media-marketing" },
  { label: "Lead Generation", href: "/services/lead-generation" },
  { label: "Business Automation", href: "/services/business-systems-automation" },
  { label: "Website Development", href: "/services/website-design-development" },
];

export const companyNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Brand System", href: "/brand-system" },
];

export const accountNav: NavItem[] = [
  { label: "Login", href: "/login" },
  { label: "Join HRIX", href: "/register" },
];
