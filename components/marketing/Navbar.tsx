"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { HrixLogo } from "@/components/brand/HrixLogo";
import { Button } from "@/components/ui/Button";
import { primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the mobile menu is open: lock page scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/70 backdrop-blur-xl">
      <div className="container-page flex h-nav items-center justify-between gap-6">
        <HrixLogo variant="navbar" href="/" priority />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-white/[0.06] text-ink"
                      : "text-muted hover:bg-white/5 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/login" variant="ghost" size="sm">
            Login
          </Button>
          <Button href="/register" size="sm">
            Join HRIX
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-white/5 lg:hidden"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <Menu className="h-5 w-5" aria-hidden />
          )}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full h-[calc(100dvh-68px)] overflow-y-auto border-t border-line/70 bg-canvas/95 backdrop-blur-xl lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="container-page flex min-h-full flex-col justify-between gap-10 py-8"
          >
            <ul className="flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href} className="border-b border-line/70">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "font-display flex items-center justify-between py-4 text-2xl font-semibold tracking-tight",
                      isActive(item.href) ? "text-ink" : "text-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <Button href="/register" size="lg" className="w-full">
                Join HRIX
              </Button>
              <Button href="/login" variant="secondary" size="lg" className="w-full">
                Login
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
