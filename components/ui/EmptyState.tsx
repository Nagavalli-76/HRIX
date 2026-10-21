import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon, title, body, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-line-strong px-6 py-16 text-center">
      {icon ? (
        <span aria-hidden className="text-faint">
          {icon}
        </span>
      ) : null}
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">{body}</p>
      </div>
      {actionLabel && actionHref ? (
        <Button href={actionHref} variant="secondary" size="sm">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
