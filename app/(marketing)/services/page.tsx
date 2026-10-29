import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Layers, Megaphone, Users, Target, Cpu, Globe } from "lucide-react";
import { serviceList } from "@/data/services";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Agency & Growth Services | HRIX",
  },
  description:
    "Explore HRIX services: branding, influencer marketing, digital advertising, social media visibility, lead generation, custom business automation, and web development.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Agency & Growth Services | HRIX",
    description:
      "Explore HRIX services: branding, influencer marketing, digital advertising, social media visibility, lead generation, custom business automation, and web development.",
    url: "https://hrixofficial.in/services",
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

export default function ServicesIndexPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]);
  const orgSchema = getOrganizationSchema();

  return (
    <>
      <JsonLd data={[orgSchema, breadcrumbSchema]} />

      <div className="container-page py-16 md:py-24">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="violet" className="mb-4">
            End-to-End Growth Solutions
          </Badge>
          <h1 className="text-display">Services Engineered for Modern Business Growth</h1>
          <p className="mt-5 text-lg text-muted">
            From establishing market authority through branding and creator partnerships to
            deploying high-converting web applications and automated business workflows.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((service, index) => {
            const Icon = SERVICE_ICONS[service.slug] || Sparkles;
            const isFeatured = index === 0;

            return (
              <GlassCard
                key={service.slug}
                tone={isFeatured ? "accent" : "default"}
                interactive
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet/10 text-violet">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <Badge tone="neutral">Service {index + 1}</Badge>
                  </div>

                  <h2 className="mt-5 text-xl font-semibold text-ink">
                    <Link
                      href={`/services/${service.slug}`}
                      className="transition-colors hover:text-violet-soft"
                    >
                      {service.name}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm text-muted line-clamp-3">
                    {service.summary}
                  </p>

                  <div className="mt-6 border-t border-line/50 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-faint">
                      Key Deliverables
                    </span>
                    <ul className="mt-2.5 space-y-1.5 text-xs text-muted">
                      {service.deliverables.slice(0, 3).map((item) => (
                        <li key={item.title} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-violet shrink-0" aria-hidden />
                          <span>{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-soft hover:underline"
                  >
                    View details & workflow
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 rounded-2xl border border-line bg-gradient-to-br from-surface to-surface-raised p-8 text-center md:p-12">
          <h2 className="text-headline">Have a specific project in mind?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Whether you need a dedicated influencer campaign, a brand overhaul, or custom workflow
            automation, our team is ready to discuss your goals.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Contact HRIX Team
            </Button>
            <Button href="/register" variant="secondary" size="lg">
              Join the Network
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
