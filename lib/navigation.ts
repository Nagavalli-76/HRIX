export interface NavItem {
  label: string;
  href: string;
}

/** Public website navigation. Shared by the navbar, mobile menu and footer. */
export const primaryNav: NavItem[] = [
  { label: "Creators", href: "/creators" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "For Brands", href: "/brands" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

export const companyNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Brand System", href: "/brand-system" },
];

export const accountNav: NavItem[] = [
  { label: "Login", href: "/login" },
  { label: "Join HRIX", href: "/register" },
];
