import type { Metadata } from "next";
import { HrixLogo } from "@/components/brand/HrixLogo";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "Brand Onboarding",
};

export default function BrandOnboardingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main" className="min-h-screen">
      <div className="border-b border-line/70">
        <div className="container-page flex h-nav items-center">
          <HrixLogo variant="navbar" href="/" />
        </div>
      </div>
      <div className="container-page max-w-2xl py-10 md:py-14">{children}</div>
    </main>
  );
}
