"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { subscribeBrandAccess } from "@/lib/actions/brand-access";

export function BrandAccessSubscribeButton({
  planId = "brand-directory-access",
  label = "Activate Brand Directory Access",
}: {
  planId?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await subscribeBrandAccess(planId);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to activate subscription.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleSubscribe}
        size="lg"
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? "Activating access..." : label}
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
