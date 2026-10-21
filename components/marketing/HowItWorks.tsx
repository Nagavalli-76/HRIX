import { WorkflowSteps } from "@/components/marketing/WorkflowSteps";

const CREATOR_FLOW = [
  { title: "Create profile", description: "Add your platforms, niche and portfolio in one place." },
  { title: "Discover campaigns", description: "See campaigns matched to your audience and category." },
  { title: "Apply", description: "Submit your rate and availability directly through HRIX." },
  { title: "Collaborate", description: "Message the brand, submit content and track feedback." },
  { title: "Get paid", description: "Payment status updates as each milestone is approved." },
];

const BRAND_FLOW = [
  { title: "Create brand profile", description: "Set up your business details and verification." },
  { title: "Launch campaign", description: "Define budget, deliverables, platforms and deadline." },
  { title: "Discover creators", description: "Filter by category, location, audience and engagement." },
  { title: "Select", description: "Shortlist, message and confirm the creators you want." },
  { title: "Measure results", description: "Track deliverables and campaign performance in one dashboard." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="border-t border-line/70">
      <div className="container-page py-16 md:py-24">
        <h2 id="how-heading" className="text-headline max-w-xl">
          How HRIX works
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          The same journey, built for both sides of a collaboration.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          <WorkflowSteps heading="For creators" steps={CREATOR_FLOW} accent="violet" />
          <WorkflowSteps heading="For brands" steps={BRAND_FLOW} accent="blue" />
        </div>
      </div>
    </section>
  );
}
