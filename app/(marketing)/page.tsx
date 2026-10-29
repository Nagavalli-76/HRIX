import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Layers, Users, Megaphone, Sparkles, Target, Cpu, Globe } from "lucide-react";
import { Hero } from "@/components/marketing/Hero";
import { TrustMetrics } from "@/components/marketing/TrustMetrics";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { BenefitsSection } from "@/components/marketing/BenefitsSection";
import { CreatorProfilePreview } from "@/components/marketing/previews/CreatorProfilePreview";
import { BrandDiscoveryPreview } from "@/components/marketing/previews/BrandDiscoveryPreview";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/schema";
import { serviceList } from "@/data/services";

export const metadata: Metadata = {
  title: {
    absolute: "HRIX | Branding, Digital Marketing & Influencer Agency",
  },
  description:
    "HRIX helps businesses grow through branding, influencer collaborations, digital marketing, paid advertising, lead generation, and business automation.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HRIX | Branding, Digital Marketing & Influencer Agency",
    description:
      "HRIX helps businesses grow through branding, influencer collaborations, digital marketing, paid advertising, lead generation, and business automation.",
    url: "https://hrixofficial.in",
    siteName: "HRIX",
  },
};

const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  "branding-and-identity": Layers,
  "influencer-marketing": Users,
  "digital-marketing-advertising": Megaphone,
  "social-media-marketing": Sparkles,
  "lead-generation": Target,
  "business-systems-automation": Cpu,
  "website-design-development": Globe,
};

export default function HomePage() {
  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <>
      <JsonLd data={[orgSchema, webSiteSchema]} />

      <Hero />
      <TrustMetrics />

      {/* Core Agency & Growth Services Section */}
      <section aria-labelledby="services-overview-heading" className="border-t border-line/70">
        <div className="container-page py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <Badge tone="violet" className="mb-3">
                Full-Suite Capabilities
              </Badge>
              <h2 id="services-overview-heading" className="text-display">
                Comprehensive Growth & Systems Solutions
              </h2>
              <p className="mt-4 text-muted">
                From brand positioning and creator campaigns to performance advertising,
                web applications, and end-to-end workflow automation.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-soft hover:underline shrink-0"
            >
              Browse all 7 services <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((service) => {
              const Icon = SERVICE_ICONS[service.slug] || Sparkles;
              return (
                <GlassCard key={service.slug} interactive className="flex flex-col justify-between">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-violet">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-ink">
                      <Link
                        href={`/services/${service.slug}`}
                        className="hover:text-violet-soft transition-colors"
                      >
                        {service.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-3">
                      {service.summary}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-line/50">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-violet-soft hover:underline"
                    >
                      Learn more <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorks />

      <BenefitsSection
        id="for-creators"
        heading="Turn your influence into opportunities"
        body="A professional profile, campaign discovery and a clear record of every collaboration you complete."
        items={[
          { title: "Professional creator profile", description: "Show your platforms, audience and past work in one place." },
          { title: "Campaign discovery", description: "See campaigns matched to your category and audience." },
          { title: "Applications and portfolio", description: "Apply with your rate card and a portfolio brands can review." },
          { title: "Earnings tracking", description: "Follow payments and campaign history as they happen." },
        ]}
        ctaLabel="Join as Creator"
        ctaHref="/register?role=creator"
        preview={<CreatorProfilePreview />}
      />

      <BenefitsSection
        id="for-brands"
        heading="Find creators who fit your campaign"
        body="Filter by category, location and engagement, then manage the whole collaboration from one dashboard."
        items={[
          { title: "Creator discovery", description: "Filter by audience relevance, location, category and platform." },
          { title: "Shortlisting", description: "Compare creators side by side before you commit budget." },
          { title: "Campaign management", description: "Track applications, deliverables and results in one place." },
        ]}
        ctaLabel="For Brands"
        ctaHref="/brands"
        preview={<BrandDiscoveryPreview />}
        previewSide="left"
      />

      <section id="pricing" className="border-t border-line/70">
        <div className="container-page py-16 md:py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-headline">Creator membership</h2>
            <p className="mt-4 text-muted">
              Start with access, improve your profile, or take the complete
              creator growth path. No guaranteed campaigns or income — just
              structured support for your creator presence.
            </p>
          </div>
          <div className="mt-12">
            <PricingTiers />
          </div>
        </div>
      </section>
    </>
  );
}
