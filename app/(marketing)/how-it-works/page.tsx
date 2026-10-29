import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getFAQSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "How It Works | Creator & Brand Collaboration Process · HRIX",
  description:
    "Understand the step-by-step HRIX workflow: creator onboarding, brand campaign matching, content approval, milestone tracking, and secure payment disbursements.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How It Works | Creator & Brand Collaboration Process · HRIX",
    description:
      "Understand the step-by-step HRIX workflow: creator onboarding, brand campaign matching, content approval, milestone tracking, and secure payment disbursements.",
    url: "https://hrixofficial.in/how-it-works",
    siteName: "HRIX",
  },
};

const HOW_IT_WORKS_FAQS = [
  {
    question: "Do creators need a minimum follower count to join HRIX?",
    answer:
      "No. HRIX is profile-first and value-driven. Creators at any stage can register, create a professional profile, and access growth resources.",
  },
  {
    question: "How do brands verify creator metrics and audience relevance?",
    answer:
      "Brand partners review verified profiles containing verified social handles, primary niches, cities, and past portfolio collaboration assets.",
  },
  {
    question: "How does payment protection work on HRIX?",
    answer:
      "Campaign deliverables and milestones are tracked systematically inside the HRIX dashboard, ensuring clear status updates as work is submitted and approved.",
  },
  {
    question: "Can brands launch multi-channel campaigns with different creators?",
    answer:
      "Yes. Brands can configure campaigns across multiple platforms including Instagram, YouTube, and LinkedIn, selecting creators tailored to each channel.",
  },
];

export default function HowItWorksPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
  ]);

  const faqSchema = getFAQSchema(HOW_IT_WORKS_FAQS);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema]} />

      <div className="pt-16 md:pt-20">
        <div className="container-page">
          <Badge tone="violet" className="mb-4">
            Structured Workflow
          </Badge>
          <h1 className="text-display max-w-3xl">
            Discover, Match, Collaborate, and Grow
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            HRIX streamlines the entire collaboration cycle for creators and brands: from discovery
            and matching to content submission, deliverable verification, and timely compensation.
          </p>
        </div>

        <HowItWorks />

        {/* FAQ Section */}
        <div className="container-page pb-20 border-t border-line/70 pt-16">
          <div className="max-w-2xl">
            <h2 className="text-headline">Workflow FAQs</h2>
            <p className="mt-3 text-muted">
              Common questions about how HRIX manages collaborations and milestones.
            </p>
          </div>

          <div className="mt-8 space-y-4 max-w-3xl">
            {HOW_IT_WORKS_FAQS.map((faq, i) => (
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

          {/* Next steps */}
          <div className="mt-16 flex flex-col gap-3 sm:flex-row">
            <Button href="/register" size="lg">
              Get Started with HRIX
            </Button>
            <Button href="/services" variant="secondary" size="lg">
              Explore Agency Services
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
