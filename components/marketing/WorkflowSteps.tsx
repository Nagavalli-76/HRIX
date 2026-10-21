"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface WorkflowStep {
  title: string;
  description: string;
}

export interface WorkflowStepsProps {
  heading: string;
  steps: WorkflowStep[];
  accent?: "violet" | "blue";
}

/**
 * A numbered flow — used for the Creator flow and the Brand flow, which are
 * genuinely sequential, so numbering here is informative rather than decorative.
 */
export function WorkflowSteps({ heading, steps, accent = "violet" }: WorkflowStepsProps) {
  const dot = accent === "violet" ? "bg-violet" : "bg-blue";
  const ring = accent === "violet" ? "ring-violet/30" : "ring-blue/30";

  return (
    <div>
      <h3 className="text-title text-ink">{heading}</h3>
      <ol className="relative mt-6 space-y-0">
        {steps.map((step, index) => (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="relative flex gap-5 pb-8 last:pb-0"
          >
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-line-strong"
              />
            ) : null}
            <span
              aria-hidden
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-canvas ring-4 ring-canvas",
                dot,
                ring,
              )}
            >
              {index + 1}
            </span>
            <div className="pt-0.5">
              <p className="font-medium text-ink">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
