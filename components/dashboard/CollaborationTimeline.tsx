import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { CollaborationEvent, CollaborationStatus } from "@/types";

export const COLLABORATION_STAGES: CollaborationStatus[] = [
  "pending",
  "accepted",
  "active",
  "content-submitted",
  "under-review",
  "revision-requested",
  "approved",
  "published",
  "completed",
];

const STAGE_LABEL: Record<CollaborationStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  active: "Active",
  "content-submitted": "Content Submitted",
  "under-review": "Under Review",
  "revision-requested": "Revision Requested",
  approved: "Approved",
  published: "Published",
  completed: "Completed",
};

/** Visual status pipeline for a single collaboration, with timestamps for reached stages. */
export function CollaborationTimeline({
  status,
  timeline,
}: {
  status: CollaborationStatus;
  timeline: CollaborationEvent[];
}) {
  const currentIndex = COLLABORATION_STAGES.indexOf(status);
  const eventByStatus = new Map(timeline.map((event) => [event.status, event]));

  return (
    <ol className="space-y-0">
      {COLLABORATION_STAGES.map((stage, index) => {
        const event = eventByStatus.get(stage);
        const reached = index <= currentIndex;
        const isLast = index === COLLABORATION_STAGES.length - 1;

        return (
          <li key={stage} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%-0.75rem)] w-px",
                  index < currentIndex ? "bg-violet" : "bg-line-strong",
                )}
              />
            ) : null}
            <span
              aria-hidden
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-canvas",
                reached ? "bg-violet text-canvas" : "bg-white/5 text-faint",
              )}
            >
              {reached ? <Check className="h-3.5 w-3.5" /> : null}
            </span>
            <div className="pt-0.5">
              <p className={cn("text-sm font-medium", reached ? "text-ink" : "text-faint")}>
                {STAGE_LABEL[stage]}
              </p>
              {event ? (
                <p className="text-sm text-faint">
                  {formatDate(event.timestamp)}
                  {event.note ? ` · ${event.note}` : ""}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
