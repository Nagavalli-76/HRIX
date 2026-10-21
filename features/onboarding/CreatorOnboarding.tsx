"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormStepper } from "@/components/ui/FormStepper";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { PricingTiers } from "@/components/marketing/PricingTiers";
import type { Category, City, Platform } from "@/types";

const CATEGORIES: Category[] = [
  "Fashion", "Food", "Fitness", "Education", "Technology",
  "Beauty", "Travel", "Lifestyle", "Gaming", "Finance", "Real Estate",
];

const CITIES: City[] = [
  "Hyderabad", "Kakinada", "Rajahmundry", "Vijayawada",
  "Visakhapatnam", "Bengaluru", "Chennai", "Mumbai",
];

const PLATFORMS: Platform[] = ["Instagram", "YouTube", "X", "LinkedIn"];

const STEPS = [
  { title: "Account" },
  { title: "Public profile" },
  { title: "Social platforms" },
  { title: "Category & niche" },
  { title: "Location" },
  { title: "Audience" },
  { title: "Portfolio" },
  { title: "Rate card" },
  { title: "Review" },
  { title: "Membership" },
];

interface FormState {
  displayName: string;
  username: string;
  bio: string;
  platform: Platform;
  handle: string;
  category: Category;
  niche: string;
  city: City;
  followers: string;
  portfolioTitle: string;
  rate: string;
}

const INITIAL_STATE: FormState = {
  displayName: "",
  username: "",
  bio: "",
  platform: "Instagram",
  handle: "",
  category: "Fitness",
  niche: "",
  city: "Hyderabad",
  followers: "",
  portfolioTitle: "",
  rate: "",
};

import { saveCreatorOnboarding } from "@/lib/actions/onboarding";

export function CreatorOnboarding() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const isLastStep = stepIndex === STEPS.length - 1;

  const goNext = async () => {
    if (isLastStep) {
      setSubmitting(true);
      setError(null);
      const res = await saveCreatorOnboarding(form);
      if (res.error) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      router.push("/creator/dashboard");
      return;
    }
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  };

  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  return (
    <div>
      <h1 className="text-headline">Set up your creator profile</h1>
      <p className="mt-2 text-muted">
        This only takes a few minutes. You can edit everything later.
      </p>

      <div className="mt-8">
        <FormStepper steps={STEPS} currentIndex={stepIndex} />
      </div>

      <GlassCard tone="raised" className="mt-6">
        {error ? (
          <div
            role="alert"
            className="mb-6 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {error}
          </div>
        ) : null}

        <StepContent stepIndex={stepIndex} form={form} update={update} />

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={stepIndex === 0 || submitting}
          >
            Back
          </Button>
          <Button type="button" onClick={goNext} disabled={submitting}>
            {submitting ? "Saving profile..." : isLastStep ? "Go to dashboard" : "Continue"}
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}

function StepContent({
  stepIndex,
  form,
  update,
}: {
  stepIndex: number;
  form: FormState;
  update: (patch: Partial<FormState>) => void;
}) {
  switch (stepIndex) {
    case 0:
      return (
        <div className="space-y-4">
          <Input
            label="Full name"
            value={form.displayName}
            onChange={(e) => update({ displayName: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            hint="Used to log in and for campaign notifications."
            required
          />
          <Input label="Password" type="password" required />
        </div>
      );

    case 1:
      return (
        <div className="space-y-4">
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => update({ username: e.target.value })}
            hint="This is how brands will find you on HRIX."
            required
          />
          <Textarea
            label="Short bio"
            value={form.bio}
            onChange={(e) => update({ bio: e.target.value })}
            hint="A sentence or two about the content you make."
          />
        </div>
      );

    case 2:
      return (
        <div className="space-y-4">
          <Select
            label="Primary platform"
            value={form.platform}
            onChange={(e) => update({ platform: e.target.value as Platform })}
          >
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </Select>
          <Input
            label="Handle"
            placeholder="@yourhandle"
            value={form.handle}
            onChange={(e) => update({ handle: e.target.value })}
            required
          />
          <p className="text-sm text-faint">
            You can add more platforms from your dashboard after signing up.
          </p>
        </div>
      );

    case 3:
      return (
        <div className="space-y-4">
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => update({ category: e.target.value as Category })}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Input
            label="Niche"
            placeholder="e.g. home workouts, budget travel"
            value={form.niche}
            onChange={(e) => update({ niche: e.target.value })}
          />
        </div>
      );

    case 4:
      return (
        <Select
          label="City"
          value={form.city}
          onChange={(e) => update({ city: e.target.value as City })}
        >
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      );

    case 5:
      return (
        <Input
          label="Follower count"
          type="number"
          min={0}
          value={form.followers}
          onChange={(e) => update({ followers: e.target.value })}
          hint="Your primary platform's current follower count."
        />
      );

    case 6:
      return (
        <div className="space-y-4">
          <Input
            label="A piece of work you're proud of"
            value={form.portfolioTitle}
            onChange={(e) => update({ portfolioTitle: e.target.value })}
            hint="You can add more to your portfolio later."
          />
        </div>
      );

    case 7:
      return (
        <Input
          label="Starting rate (₹)"
          type="number"
          min={0}
          value={form.rate}
          onChange={(e) => update({ rate: e.target.value })}
          hint="Per deliverable. You can set different rates per campaign later."
        />
      );

    case 8:
      return (
        <dl className="space-y-3 text-sm">
          <ReviewRow label="Name" value={form.displayName || "—"} />
          <ReviewRow label="Username" value={form.username || "—"} />
          <ReviewRow label="Platform" value={`${form.platform} · ${form.handle || "—"}`} />
          <ReviewRow label="Category" value={`${form.category}${form.niche ? ` · ${form.niche}` : ""}`} />
          <ReviewRow label="City" value={form.city} />
          <ReviewRow label="Followers" value={form.followers || "—"} />
          <ReviewRow label="Starting rate" value={form.rate ? `₹${form.rate}` : "—"} />
          <p className="pt-2 text-faint">
            Your public profile only shows what you&apos;ve entered here —
            never payment details or ID documents.
          </p>
        </dl>
      );

    case 9:
      return (
        <div>
          <p className="mb-6 text-sm text-muted">
            One last step — choose how you want to start on HRIX. You can add
            a Profile Audit or Growth Plan later from your dashboard.
          </p>
          <PricingTiers />
        </div>
      );

    default:
      return null;
  }
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2 last:border-0">
      <dt className="text-faint">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
