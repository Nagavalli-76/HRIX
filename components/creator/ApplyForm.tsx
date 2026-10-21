"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyToCampaign } from "@/lib/actions/applications";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function ApplyForm({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const result = await applyToCampaign(campaignId, formData);
      if ("error" in result) {
        setMessage(result.error ?? "Unable to apply.");
        return;
      }
      setMessage("Application submitted.");
      setOpen(false);
      router.refresh();
    });
  }

  if (!open) return <Button size="lg" onClick={() => setOpen(true)}>Apply now</Button>;

  return (
    <form action={submit} className="w-full max-w-md space-y-4 rounded-lg border border-line bg-surface p-4 sm:p-5">
      <Textarea label="Your proposal" name="proposal" required minLength={20} maxLength={3000} placeholder="Tell the brand why you are a strong fit." />
      <Input label="Expected price (INR)" name="expectedPrice" type="number" min="0" step="1" required />
      {message ? <p role="alert" className="text-sm text-danger">{message}</p> : null}
      <div className="flex gap-3">
        <Button type="submit" loading={isPending}>Submit application</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}
