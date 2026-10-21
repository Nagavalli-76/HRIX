import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export interface BenefitItem {
  title: string;
  description: string;
}

export interface BenefitsSectionProps {
  id?: string;
  eyebrow?: string;
  heading: string;
  body: string;
  items: BenefitItem[];
  ctaLabel: string;
  ctaHref: string;
  preview: ReactNode;
  /** Which side the preview panel sits on at desktop width. */
  previewSide?: "left" | "right";
}

export function BenefitsSection({
  id,
  heading,
  body,
  items,
  ctaLabel,
  ctaHref,
  preview,
  previewSide = "right",
}: BenefitsSectionProps) {
  return (
    <section id={id} className="border-t border-line/70">
      <div className="container-page py-16 md:py-24">
        <div
          className={cn(
            "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
            previewSide === "left" && "lg:[&>*:first-child]:order-2",
          )}
        >
          <div>
            <h2 className="text-headline max-w-lg">{heading}</h2>
            <p className="mt-4 max-w-md text-muted">{body}</p>

            <ul className="mt-8 space-y-5">
              {items.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button href={ctaHref} className="mt-9">
              {ctaLabel}
            </Button>
          </div>

          <GlassCard tone="raised" className="lg:sticky lg:top-24">
            {preview}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
