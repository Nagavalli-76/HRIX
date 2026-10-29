import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { servicesData, serviceList } from "@/data/services";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFAQSchema, getServiceSchema } from "@/lib/seo/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return serviceList.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) return { title: "Service Not Found" };

  return {
    title: {
      absolute: service.title,
    },
    description: service.metaDescription,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      url: `https://hrixofficial.in/services/${service.slug}`,
      siteName: "HRIX",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.metaDescription,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ]);

  const serviceSchema = getServiceSchema({
    name: service.name,
    serviceType: service.eyebrow,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
  });

  const faqSchema = getFAQSchema(service.faqs);

  const relatedServices = service.relatedSlugs
    .map((s) => servicesData[s])
    .filter(Boolean);

  return (
    <>
      <JsonLd data={[serviceSchema, breadcrumbs, faqSchema]} />

      <article className="container-page py-14 md:py-20">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5 text-faint" /></li>
            <li>
              <Link href="/services" className="hover:text-ink transition-colors">
                Services
              </Link>
            </li>
            <li aria-hidden><ChevronRight className="h-3.5 w-3.5 text-faint" /></li>
            <li className="text-ink font-medium" aria-current="page">
              {service.name}
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="max-w-3xl">
          <Badge tone="violet" className="mb-4">
            {service.eyebrow}
          </Badge>
          <h1 className="text-display">{service.h1}</h1>
          <p className="mt-6 text-lg text-muted md:text-xl leading-relaxed">
            {service.summary}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Start a Project
            </Button>
            <Button href="/register" variant="secondary" size="lg">
              Get Started with HRIX
            </Button>
          </div>
        </header>

        {/* Target Audience Section */}
        <section aria-labelledby="audience-heading" className="mt-20 border-t border-line/70 pt-16">
          <div className="max-w-2xl">
            <h2 id="audience-heading" className="text-headline">
              Who This Service Is Designed For
            </h2>
            <p className="mt-3 text-muted">
              We align our scope with businesses and founders facing specific growth inflection points.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.targetAudience.map((audience, i) => (
              <GlassCard key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-violet shrink-0" aria-hidden />
                <span className="text-sm text-ink">{audience}</span>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Deliverables Section */}
        <section aria-labelledby="deliverables-heading" className="mt-20 border-t border-line/70 pt-16">
          <div className="max-w-2xl">
            <h2 id="deliverables-heading" className="text-headline">
              Core Deliverables
            </h2>
            <p className="mt-3 text-muted">
              Tangible systems, strategies, and assets delivered during our engagement.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {service.deliverables.map((item, idx) => (
              <GlassCard key={idx} tone={idx === 0 ? "accent" : "default"}>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section aria-labelledby="workflow-heading" className="mt-20 border-t border-line/70 pt-16">
          <div className="max-w-2xl">
            <h2 id="workflow-heading" className="text-headline">
              Our Execution Workflow
            </h2>
            <p className="mt-3 text-muted">
              A transparent, disciplined step-by-step methodology from initial briefing to final delivery.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.workflow.map((w) => (
              <div
                key={w.step}
                className="relative rounded-lg border border-line bg-surface/50 p-6 backdrop-blur-sm"
              >
                <span className="font-display text-3xl font-bold text-violet/40">
                  {w.step}
                </span>
                <h3 className="mt-3 text-base font-semibold text-ink">{w.title}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {w.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section aria-labelledby="faq-heading" className="mt-20 border-t border-line/70 pt-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-violet">
              <HelpCircle className="h-5 w-5" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wider">FAQs</span>
            </div>
            <h2 id="faq-heading" className="mt-2 text-headline">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted">
              Clear answers to common questions about {service.name.toLowerCase()}.
            </p>
          </div>

          <div className="mt-8 space-y-4 max-w-3xl">
            {service.faqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-lg border border-line bg-surface/60 p-5 open:bg-surface transition-colors"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-ink">
                  <span>{faq.question}</span>
                  <span className="ml-4 text-faint transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-sm text-muted leading-relaxed border-t border-line/50 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-20 border-t border-line/70 pt-16">
            <h2 id="related-heading" className="text-headline">
              Related HRIX Capabilities
            </h2>
            <p className="mt-3 text-muted">
              Pair {service.name} with complementary services for maximum impact.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {relatedServices.map((rel) => (
                <GlassCard key={rel.slug} interactive>
                  <h3 className="text-base font-semibold text-ink">
                    <Link
                      href={`/services/${rel.slug}`}
                      className="hover:text-violet-soft transition-colors"
                    >
                      {rel.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-muted line-clamp-2">
                    {rel.summary}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/services/${rel.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-violet-soft hover:underline"
                    >
                      Explore service <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action Banner */}
        <div className="mt-20 rounded-2xl border border-line bg-surface-raised p-8 text-center md:p-12">
          <h2 className="text-headline">Ready to move forward with {service.name}?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Discuss your requirements, campaign timeline, or technical specifications with the HRIX team.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Contact Us for a Quote
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Browse All Services
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
