"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HrixLogo } from "@/components/brand/HrixLogo";
import { getNavForRole, type DashboardNavItem } from "@/lib/dashboard-nav";
import { cn } from "@/lib/cn";

export function Sidebar({
  items,
  role,
}: {
  items?: DashboardNavItem[];
  role?: "creator" | "brand" | "admin";
}) {
  const pathname = usePathname();
  const navItems = items ?? getNavForRole(role);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line/70 bg-canvas-alt lg:flex">
      <div className="flex h-nav items-center border-b border-line/70 px-6">
        <HrixLogo variant="sidebar" href="/" />
      </div>
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {

            const isOverview = item.href.endsWith("/dashboard") || item.href === "/admin";
            const active = isOverview
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-white/[0.07] text-ink" : "text-muted hover:bg-white/5 hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
