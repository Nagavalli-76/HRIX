import type { Metadata } from "next";
import { BrandOnboarding } from "@/features/onboarding/BrandOnboarding";

export const metadata: Metadata = { title: "Brand Onboarding" };

export default function BrandOnboardingPage() {
  return <BrandOnboarding />;
}
