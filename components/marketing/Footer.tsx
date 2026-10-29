import Link from "next/link";
import { HrixLogo } from "@/components/brand/HrixLogo";
import { accountNav, companyNav, primaryNav, servicesNav, type NavItem } from "@/lib/navigation";

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-4 space-y-2.5">
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
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_0.9fr_0.9fr] lg:gap-8">
        <div className="max-w-xs">
          <HrixLogo variant="footer" href="/" />
          <p className="mt-5 text-sm text-muted leading-relaxed">
            HRIX is a branding, digital marketing, influencer collaboration, and
            business automation agency and creator network.
          </p>
          <div className="mt-4 text-xs text-faint">
            Official contact:{" "}
            <a
              href="mailto:hrixofficial@gmail.com"
              className="text-muted hover:text-ink transition-colors"
            >
              hrixofficial@gmail.com
            </a>
          </div>
        </div>
        <FooterColumn title="Platform" items={primaryNav} />
        <FooterColumn title="Services" items={servicesNav} />
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
