"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export interface StepperStep {
  title: string;
}

export interface FormStepperProps {
  steps: StepperStep[];
  currentIndex: number;
}

/** Horizontal, scrollable step indicator for multi-step onboarding flows. */
export function FormStepper({ steps, currentIndex }: FormStepperProps) {
  return (
    <ol
      aria-label="Onboarding progress"
      className="flex gap-1 overflow-x-auto pb-1"
    >
      {steps.map((step, index) => {
        const state =
          index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";

        return (
          <li key={step.title} className="flex flex-1 items-center gap-1.5">
            <span
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold",
                state === "done" && "bg-violet text-canvas",
                state === "current" && "bg-white/10 text-ink ring-2 ring-violet",
                state === "upcoming" && "bg-white/5 text-faint",
              )}
            >
              {state === "done" ? <Check className="h-3.5 w-3.5" aria-hidden /> : index + 1}
            </span>
            <span
              className={cn(
                "hidden truncate text-xs sm:block",
                state === "upcoming" ? "text-faint" : "text-muted",
              )}
            >
              {step.title}
            </span>
            {index < steps.length - 1 ? (
              <span aria-hidden className="h-px flex-1 bg-line-strong" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
