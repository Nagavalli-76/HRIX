"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
    };
  }
}

export function RazorpayCheckoutButton({
  planId,
  label,
  onComplete,
}: {
  planId: string;
  label: string;
  onComplete?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const orderResponse = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order.error || "Unable to create payment order.");
      const loadScript = await import("@/lib/payments/load-razorpay");
      if (!(await loadScript.loadRazorpay())) throw new Error("Razorpay Checkout could not be loaded.");
      if (!window.Razorpay) throw new Error("Razorpay Checkout is unavailable.");
      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "HRIX",
        description: order.planName,
        order_id: order.orderId,
        handler: async (response: Record<string, string>) => {
          try {
            const verification = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(response),
            });
            const result = await verification.json();
            if (!verification.ok) throw new Error(result.error || "Payment verification failed.");
            setLoading(false);
            onComplete?.();
          } catch (verificationError) {
            setError(verificationError instanceof Error ? verificationError.message : "Payment verification failed.");
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      checkout.on("payment.failed", (response: { error?: { description?: string } }) => {
        setError(response.error?.description || "Razorpay reported that the payment failed.");
        setLoading(false);
      });
      checkout.open();
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Payment could not be started.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={startCheckout} disabled={loading} className="w-full">
        {loading ? "Opening secure checkout..." : label}
      </Button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
