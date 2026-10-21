"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCampaign } from "@/lib/actions/campaigns";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { Campaign } from "@/types";

const categories = ["Fashion", "Food", "Fitness", "Education", "Technology", "Beauty", "Travel", "Lifestyle", "Gaming", "Finance", "Real Estate"];
const cities = ["Hyderabad", "Kakinada", "Rajahmundry", "Vijayawada", "Visakhapatnam", "Bengaluru", "Chennai", "Mumbai", "Remote"];
const platforms = ["Instagram", "YouTube", "X", "LinkedIn"];

type Props = { campaign?: Campaign };

export function CampaignForm({ campaign }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function submit(formData: FormData) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = campaign
        ? await import("@/lib/actions/campaigns").then(({ updateCampaign }) => updateCampaign(campaign.id, formData))
        : await createCampaign(formData);
      if ("error" in result) {
        setError(result.error ?? "Unable to save campaign.");
        return;
      }
      setSuccess(campaign ? "Campaign updated." : "Campaign created.");
      router.refresh();
    });
  }

  return (
    <form action={submit} className="mt-6 space-y-5 rounded-lg border border-line bg-surface/60 p-5">
      {error ? <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p> : null}
      {success ? <p role="status" className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">{success}</p> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Campaign title" name="title" required minLength={3} maxLength={120} defaultValue={campaign?.title} />
        <Input label="Budget (INR)" name="budget" type="number" min="1" step="1" required defaultValue={campaign?.budgetInr} />
        <Select label="Category" name="category" required defaultValue={campaign?.category ?? "Lifestyle"}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </Select>
        <Select label="City" name="city" required defaultValue={campaign?.city ?? "Remote"}>
          {cities.map((city) => <option key={city}>{city}</option>)}
        </Select>
        <Input label="Deadline" name="deadline" type="date" required defaultValue={campaign?.deadline.slice(0, 10)} />
      </div>
      <Textarea label="Campaign brief" name="summary" required minLength={20} maxLength={2000} defaultValue={campaign?.summary} />
      <Textarea label="Deliverables" name="deliverables" required hint="One deliverable per line." defaultValue={campaign?.deliverables.join("\n")} />
      <fieldset>
        <legend className="text-label mb-2 block text-muted">Platforms</legend>
        <div className="flex flex-wrap gap-3">
          {platforms.map((platform) => (
            <label key={platform} className="inline-flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="platforms" value={platform} defaultChecked={campaign?.platforms.includes(platform as never) ?? platform === "Instagram"} />
              {platform}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" loading={isPending}>{campaign ? "Save changes" : "Create campaign"}</Button>
    </form>
  );
}
