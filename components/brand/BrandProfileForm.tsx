"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBrandProfile } from "@/lib/actions/profiles";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Brand } from "@/types";

export function BrandProfileForm({ brand }: { brand?: Brand }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <form action={(data) => { setMessage(""); startTransition(async () => { const result = await updateBrandProfile(data); setMessage("error" in result ? result.error ?? "Unable to save profile." : "Profile saved."); if (!("error" in result)) router.refresh(); }); }}>
      <GlassCard tone="raised" className="mt-8 max-w-xl space-y-5">
        <Input label="Business name" name="brandName" required defaultValue={brand?.name} />
        <Input label="Website" name="website" type="url" defaultValue={brand?.website} />
        <Textarea label="Description" name="description" required defaultValue={brand?.description} />
        {message ? <p role="status" className="text-sm text-muted">{message}</p> : null}
        <div className="flex justify-end"><Button type="submit" loading={isPending}>Save changes</Button></div>
      </GlassCard>
    </form>
  );
}
