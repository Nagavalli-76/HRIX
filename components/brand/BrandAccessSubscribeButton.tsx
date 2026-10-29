"use client";

import { useRouter } from "next/navigation";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";

export function BrandAccessSubscribeButton({
  planId = "brand-directory-access",
  label = "Activate Brand Directory Access",
}: {
  planId?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <RazorpayCheckoutButton planId={planId} label={label} onComplete={() => router.refresh()} />
  );
}
