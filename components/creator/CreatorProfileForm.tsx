"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCreatorProfile } from "@/lib/actions/profiles";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Creator } from "@/types";

export function CreatorProfileForm({ creator }: { creator?: Creator }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <form action={(data) => { setMessage(""); startTransition(async () => { const result = await updateCreatorProfile(data); setMessage("error" in result ? result.error ?? "Unable to save profile." : "Profile saved."); if (!("error" in result)) router.refresh(); }); }}>
      <GlassCard tone="raised" className="mt-8 max-w-xl space-y-5">
        <Input label="Display name" name="displayName" required defaultValue={creator?.name} />
        <Input label="Username" name="username" required defaultValue={creator?.username} />
        <Textarea label="Bio" name="bio" required defaultValue={creator?.bio} />
        <Input label="Starting rate (INR)" name="startingRate" type="number" min="0" required defaultValue={creator?.startingRateInr} />
        {message ? <p role="status" className="text-sm text-muted">{message}</p> : null}
        <div className="flex justify-end"><Button type="submit" loading={isPending}>Save changes</Button></div>
      </GlassCard>
    </form>
  );
}
