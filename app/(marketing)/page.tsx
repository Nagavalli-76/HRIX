import { Hero } from "@/components/marketing/Hero";
import { TrustMetrics } from "@/components/marketing/TrustMetrics";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { BenefitsSection } from "@/components/marketing/BenefitsSection";
import { CreatorProfilePreview } from "@/components/marketing/previews/CreatorProfilePreview";
import { BrandDiscoveryPreview } from "@/components/marketing/previews/BrandDiscoveryPreview";
import { PricingTiers } from "@/components/marketing/PricingTiers";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustMetrics />
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
