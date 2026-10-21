"use client";

import { useEffect } from "react";
import { HrixLogo } from "@/components/brand/HrixLogo";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with real error reporting once a backend/observability service exists.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <HrixLogo variant="auth" href="/" />
      <div>
        <h1 className="text-headline">Something went wrong</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          That&apos;s on us, not you. Try again, or head back to the home page.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </main>
  );
}
