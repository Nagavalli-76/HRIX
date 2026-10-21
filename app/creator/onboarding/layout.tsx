import { HrixLogo } from "@/components/brand/HrixLogo";

export default function CreatorOnboardingLayout({
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
