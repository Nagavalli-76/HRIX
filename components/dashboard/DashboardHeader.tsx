"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { HrixLogo } from "@/components/brand/HrixLogo";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationsPopover } from "@/components/dashboard/NotificationsPopover";
import { getNavForRole, type DashboardNavItem } from "@/lib/dashboard-nav";
import type { AppNotification } from "@/types";
import { cn } from "@/lib/cn";

export function DashboardHeader({
  navItems,
  role,
  userName,
  notifications = [],
}: {
  navItems?: DashboardNavItem[];
  role?: "creator" | "brand" | "admin";
  userName: string;
  notifications?: AppNotification[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = navItems ?? getNavForRole(role);


  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
      <div className="flex h-nav items-center justify-between gap-4 px-4 md:px-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="-ml-1.5 flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-white/5 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <span className="hidden lg:block" />


        <div className="flex items-center gap-3">
          <NotificationsPopover notifications={notifications} />
          <Avatar name={userName} size="sm" />
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label="Dashboard"
            className="absolute inset-y-0 left-0 flex w-72 flex-col bg-canvas-alt"
          >
            <div className="flex h-nav items-center justify-between border-b border-line/70 px-4">
              <HrixLogo variant="sidebar" href="/" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-white/5"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
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
        </div>
      ) : null}
    </header>
  );
}
