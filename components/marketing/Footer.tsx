import Link from "next/link";
import { HrixLogo } from "@/components/brand/HrixLogo";
import { accountNav, companyNav, primaryNav, type NavItem } from "@/lib/navigation";

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-canvas-alt">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12">
        <div className="max-w-xs">
          <HrixLogo variant="footer" href="/" />
          <p className="mt-5 text-sm text-muted">
            The Creator × Brand Growth Network. Discover, match, collaborate and
            get paid, in one place.
          </p>
        </div>
        <FooterColumn title="Platform" items={primaryNav} />
        <FooterColumn title="Company" items={companyNav} />
        <FooterColumn title="Account" items={accountNav} />
      </div>
      <div className="border-t border-line/70">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span>© {new Date().getFullYear()} HRIX. All rights reserved.</span>
          <span className="sm:text-right">Creator membership from ₹99/month.</span>
        </div>
      </div>
    </footer>
  );
}
