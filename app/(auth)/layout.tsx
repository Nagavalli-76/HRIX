import { HrixLogo } from "@/components/brand/HrixLogo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main" className="relative isolate flex min-h-screen flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.14),transparent)]" />
      </div>

      <div className="container-page flex flex-1 flex-col items-center justify-center py-16">
        <HrixLogo variant="auth" href="/" priority className="mb-10" />
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}
