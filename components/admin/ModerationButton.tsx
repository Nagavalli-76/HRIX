"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { moderateRecord } from "@/lib/actions/moderation";
import { Button } from "@/components/ui/Button";

export function ModerationButton({
  targetType,
  targetId,
  value,
  label,
  variant = "secondary",
  promptReason = false,
}: {
  targetType: "creator" | "brand" | "campaign" | "application";
  targetId: string;
  value: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  /** When true, prompt the admin for an optional reason (e.g. for rejection). */
  promptReason?: boolean;
}) {
  const [error, setError] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function moderate() {
    if (!window.confirm(`${label}?`)) return;

    let reason: string | undefined;
    if (promptReason) {
      reason = window.prompt("Optional reason (visible to the user):") ?? undefined;
    }

    setError("");
    setEmailStatus("");
    startTransition(async () => {
      const result = await moderateRecord(targetType, targetId, value, reason);
      if ("error" in result) {
        setError(result.error ?? "Unable to update moderation state.");
      } else {
        if (result.emailStatus === "sent") setEmailStatus("Notification sent.");
        else if (result.emailStatus === "failed") setEmailStatus("Notification could not be delivered.");
        else if (result.emailStatus === "skipped") setEmailStatus("Email not configured.");
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant={variant} size="sm" loading={isPending} onClick={moderate}>{label}</Button>
      {error ? <p role="alert" className="text-xs text-danger">{error}</p> : null}
      {emailStatus ? <p className="text-xs text-faint">{emailStatus}</p> : null}
    </div>
  );
}
