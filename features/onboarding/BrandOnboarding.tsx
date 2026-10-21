"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormStepper } from "@/components/ui/FormStepper";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { Category, City } from "@/types";

const CATEGORIES: Category[] = [
  "Fashion", "Food", "Fitness", "Education", "Technology",
  "Beauty", "Travel", "Lifestyle", "Gaming", "Finance", "Real Estate",
];

const CITIES: City[] = [
  "Hyderabad", "Kakinada", "Rajahmundry", "Vijayawada",
  "Visakhapatnam", "Bengaluru", "Chennai", "Mumbai",
];

const STEPS = [
  { title: "Business details" },
  { title: "Industry & location" },
  { title: "Review" },
];

interface FormState {
  businessName: string;
  website: string;
  description: string;
  industry: Category;
  city: City;
}

const INITIAL_STATE: FormState = {
  businessName: "",
  website: "",
  description: "",
  industry: "Fashion",
  city: "Hyderabad",
};

import { saveBrandOnboarding } from "@/lib/actions/onboarding";

export function BrandOnboarding() {
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
      const res = await saveBrandOnboarding(form);
      if (res.error) {
        setError(res.error);
        setSubmitting(false);
        return;
      }
      router.push("/brand/dashboard");
      return;
    }
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  };

  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0));

  return (
    <div>
      <h1 className="text-headline">Set up your brand profile</h1>
      <p className="mt-2 text-muted">A few details before you launch your first campaign.</p>

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
        {stepIndex === 0 ? (
          <div className="space-y-4">
            <Input
              label="Business name"
              value={form.businessName}
              onChange={(e) => update({ businessName: e.target.value })}
              required
            />
            <Input
              label="Website"
              placeholder="https://"
              value={form.website}
              onChange={(e) => update({ website: e.target.value })}
            />
            <Textarea
              label="Description"
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              hint="What your business does, in a sentence or two."
            />
          </div>
        ) : null}

        {stepIndex === 1 ? (
          <div className="space-y-4">
            <Select
              label="Industry"
              value={form.industry}
              onChange={(e) => update({ industry: e.target.value as Category })}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
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
          </div>
        ) : null}

        {stepIndex === 2 ? (
          <dl className="space-y-3 text-sm">
            <ReviewRow label="Business name" value={form.businessName || "—"} />
            <ReviewRow label="Website" value={form.website || "—"} />
            <ReviewRow label="Industry" value={form.industry} />
            <ReviewRow label="City" value={form.city} />
            <p className="pt-2 text-faint">
              You&apos;ll be able to submit business verification documents
              from your dashboard after signing up.
            </p>
          </dl>
        ) : null}

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <Button type="button" variant="ghost" onClick={goBack} disabled={stepIndex === 0 || submitting}>
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2 last:border-0">
      <dt className="text-faint">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
