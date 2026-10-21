import type { Metadata } from "next";
import { HowItWorks } from "@/components/marketing/HowItWorks";

export const metadata: Metadata = { title: "How It Works" };

export default function HowItWorksPage() {
  return (
    <div className="pt-16 md:pt-20">
      <div className="container-page">
        <h1 className="text-headline max-w-2xl">
          Discover, match, collaborate, and grow
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          HRIX manages the same journey for creators and brands: discovery,
          matching, collaboration, content, measurement, payment and growth.
        </p>
      </div>
      <HowItWorks />
    </div>
  );
}
