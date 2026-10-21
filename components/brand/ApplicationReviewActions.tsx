"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewApplication } from "@/lib/actions/applications";
import { Button } from "@/components/ui/Button";

export function ApplicationReviewActions({ applicationId }: { applicationId: string }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function review(decision: "accepted" | "rejected") {
    setError("");
    startTransition(async () => {
      const result = await reviewApplication(applicationId, decision);
      if ("error" in result) setError(result.error ?? "Unable to update application.");
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button size="sm" loading={isPending} onClick={() => review("accepted")}>Accept</Button>
        <Button size="sm" variant="danger" disabled={isPending} onClick={() => review("rejected")}>Reject</Button>
      </div>
      {error ? <p role="alert" className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
