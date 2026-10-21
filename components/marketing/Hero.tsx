import { HrixLogo } from "@/components/brand/HrixLogo";
import { Button } from "@/components/ui/Button";
import { HeroNetwork } from "@/components/marketing/HeroNetwork";

const JOURNEY = [
  "Discover",
  "Match",
  "Collaborate",
  "Create",
  "Measure",
  "Pay",
  "Grow",
] as const;

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      {/* Ambient light, kept off the logo: it comes from the background only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 top-1/3 h-[720px] w-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.14),transparent)]" />
        <div className="absolute -left-48 bottom-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(79,124,255,0.09),transparent)]" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_72%_50%,black,transparent_62%)]" />
      </div>

      <div className="container-page pt-12 md:pt-16">
        <HrixLogo variant="hero" priority />

        <h1 id="hero-heading" className="text-display mt-8 md:mt-10">
          The Creator × Brand Growth Network
        </h1>

        <div className="mt-10 grid items-center gap-12 pb-16 lg:mt-12 lg:grid-cols-[5fr_7fr] lg:gap-8 lg:pb-20">
          <div>
            <p className="max-w-[32rem] text-lg text-muted md:text-xl">
              HRIX helps creators build professional profiles, improve their
              positioning and connect with relevant brand opportunities —
              while giving brands a structured way to discover and
              collaborate with creators.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/register?role=creator" size="lg">
                Join as Creator
              </Button>
              <Button href="/brands" variant="secondary" size="lg">
                Explore for Brands
              </Button>
            </div>

            <p className="mt-5 text-sm text-faint">
              Creator membership from ₹99/month
            </p>
          </div>

          <HeroNetwork />
        </div>
      </div>

      <div className="border-t border-line/70 bg-canvas/40">
        <ol
          aria-label="The HRIX journey"
          className="container-page flex flex-wrap items-center gap-x-3 gap-y-2 py-6 text-sm text-muted"
        >
          {JOURNEY.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span>{step}</span>
              {index < JOURNEY.length - 1 ? (
                <span
                  aria-hidden
                  className="h-px w-5 bg-line-strong sm:w-10"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
