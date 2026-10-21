import type { Metadata } from "next";
import { CreatorOnboarding } from "@/features/onboarding/CreatorOnboarding";

export const metadata: Metadata = { title: "Creator Onboarding" };

export default function CreatorOnboardingPage() {
  return <CreatorOnboarding />;
}
