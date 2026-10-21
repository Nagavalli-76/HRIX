import type { LucideIcon } from "lucide-react";
import {
  BadgeIndianRupee,
  Bell,
  Briefcase,
  CreditCard,
  FolderKanban,
  Gauge,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const creatorNav: DashboardNavItem[] = [
  { label: "Overview", href: "/creator/dashboard", icon: Gauge },
  { label: "Discover Campaigns", href: "/creator/dashboard/campaigns", icon: Search },
  { label: "Applications", href: "/creator/dashboard/applications", icon: ListChecks },
  { label: "Collaborations", href: "/creator/dashboard/collaborations", icon: Briefcase },
  { label: "Messages", href: "/creator/dashboard/messages", icon: MessageSquare },
  { label: "Portfolio", href: "/creator/dashboard/portfolio", icon: FolderKanban },
  { label: "Earnings", href: "/creator/dashboard/earnings", icon: BadgeIndianRupee },
  { label: "Subscription", href: "/creator/dashboard/subscription", icon: CreditCard },
  { label: "Profile", href: "/creator/dashboard/profile", icon: User },
  { label: "Settings", href: "/creator/dashboard/settings", icon: Settings },
];

export const brandNav: DashboardNavItem[] = [
  { label: "Overview", href: "/brand/dashboard", icon: Gauge },
  { label: "My Campaigns", href: "/brand/dashboard/campaigns", icon: LayoutGrid },
  { label: "Discover Creators", href: "/brand/dashboard/creators", icon: Search },
  { label: "Applications", href: "/brand/dashboard/applications", icon: ListChecks },
  { label: "Shortlisted", href: "/brand/dashboard/shortlisted", icon: Users },
  { label: "Collaborations", href: "/brand/dashboard/collaborations", icon: Briefcase },
  { label: "Messages", href: "/brand/dashboard/messages", icon: MessageSquare },
  { label: "Analytics", href: "/brand/dashboard/analytics", icon: Gauge },
  { label: "Payments", href: "/brand/dashboard/payments", icon: Wallet },
  { label: "Business Profile", href: "/brand/dashboard/profile", icon: User },
  { label: "Settings", href: "/brand/dashboard/settings", icon: Settings },
];

export const adminNav: DashboardNavItem[] = [
  { label: "Overview", href: "/admin", icon: Gauge },
  { label: "Creators", href: "/admin/creators", icon: Users },
  { label: "Brands", href: "/admin/brands", icon: Briefcase },
  { label: "Campaigns", href: "/admin/campaigns", icon: LayoutGrid },
  { label: "Applications", href: "/admin/applications", icon: ListChecks },
  { label: "Payments", href: "/admin/payments", icon: Wallet },
  { label: "Verification", href: "/admin/verification", icon: ShieldCheck },
  { label: "Reports", href: "/admin/reports", icon: Bell },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function getNavForRole(role?: "creator" | "brand" | "admin"): DashboardNavItem[] {
  if (role === "brand") return brandNav;
  if (role === "admin") return adminNav;
  return creatorNav;
}

