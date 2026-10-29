import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Target, Users, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "About HRIX | Digital Agency & Creator Growth Network",
  },
  description:
    "Learn about HRIX — bridging the gap between brands, creators, and modern digital growth through structured collaborations, marketing systems, and transparent technology.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About HRIX | Digital Agency & Creator Growth Network",
    description:
      "Learn about HRIX — bridging the gap between brands, creators, and modern digital growth through structured collaborations, marketing systems, and transparent technology.",
    url: "https://hrixofficial.in/about",
    siteName: "HRIX",
  },
};

export default function AboutPage() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      <JsonLd data={[orgSchema, breadcrumbSchema]} />

      <div className="container-page py-16 md:py-24">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge tone="violet" className="mb-4">
            Our Purpose & Vision
          </Badge>
          <h1 className="text-display">Building Structured Growth for Creators & Brands</h1>
          <p className="mt-6 text-lg text-muted md:text-xl leading-relaxed">
            HRIX exists to bring structure, transparency, and high execution standards to digital
            growth. We connect creators building genuine influence with brands seeking verified,
            impactful marketing and technological solutions.
          </p>
        </div>

        {/* Mission & Philosophy */}
        <section aria-labelledby="philosophy-heading" className="mt-16 border-t border-line/70 pt-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 id="philosophy-heading" className="text-headline">
                The Problem with Traditional Marketing Networks
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Influencer and digital marketing in India has long been hampered by inflated vanity
                metrics, opaque pricing, delayed payment cycles, and fragmented workflows. Brands
                frequently spend money on unverified audiences, while dedicated creators struggle to
                receive clear briefs and timely compensations.
              </p>
              <p className="mt-4 text-muted leading-relaxed">
                HRIX was built from the ground up to solve these structural frictions. We unify
                creator discovery, campaign management, performance advertising, custom web development,
                and business automation into one disciplined ecosystem.
              </p>
            </div>

            <div>
              <h2 className="text-headline">Our Operating Principles</h2>
              <div className="mt-6 space-y-4">
                <GlassCard className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-violet shrink-0">
                    <ShieldCheck className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Zero Fabricated Numbers</h3>
                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      We do not display simulated follower counts or manipulated ratings. What
                      brands and creators see on HRIX is grounded in verified, real data.
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10 text-blue shrink-0">
                    <Target className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Search & Conversion Focused</h3>
                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      Every website we build, campaign we run, and workflow we automate is engineered
                      to convert visitors into long-term customer relationships.
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-violet shrink-0">
                    <Zap className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Modern Engineering & Automation</h3>
                    <p className="mt-1 text-xs text-muted leading-relaxed">
                      We leverage modern cloud technology—Next.js, TypeScript, and serverless
                      backends—to eliminate manual paperwork and speed up business execution.
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section aria-labelledby="capabilities-heading" className="mt-20 border-t border-line/70 pt-16">
          <div className="max-w-2xl">
            <h2 id="capabilities-heading" className="text-headline">
              What We Do
            </h2>
            <p className="mt-3 text-muted">
              We operate across two interconnected models: an invite-and-membership platform for
              verified creators, and an end-to-end digital agency for scaling brands.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GlassCard>
              <h3 className="text-lg font-semibold text-ink">Creator Growth Network</h3>
              <p className="mt-2 text-sm text-muted">
                Structured profiles, portfolio hosting, rate card organization, and curated brand
                opportunity access starting at ₹99/month.
              </p>
              <div className="mt-4">
                <Link href="/pricing" className="text-xs font-medium text-violet-soft hover:underline">
                  View creator plans &rarr;
                </Link>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-ink">Brand Campaign Delivery</h3>
              <p className="mt-2 text-sm text-muted">
                End-to-end influencer marketing campaigns, creator vetting, deliverable verification,
                and performance measurement.
              </p>
              <div className="mt-4">
                <Link href="/services/influencer-marketing" className="text-xs font-medium text-violet-soft hover:underline">
                  Influencer solutions &rarr;
                </Link>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-lg font-semibold text-ink">Digital Marketing & Systems</h3>
              <p className="mt-2 text-sm text-muted">
                Next.js web development, branding and visual identity systems, paid search/social ads,
                and custom operational automation.
              </p>
              <div className="mt-4">
                <Link href="/services" className="text-xs font-medium text-violet-soft hover:underline">
                  Explore all services &rarr;
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 rounded-2xl border border-line bg-surface-raised p-8 text-center md:p-12">
          <h2 className="text-headline">Connect with HRIX Today</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Whether you are a creator preparing for professional brand collaborations or a business
            scaling customer acquisition, we are here to support your journey.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Contact Team
            </Button>
            <Button href="/register" variant="secondary" size="lg">
              Join HRIX
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
