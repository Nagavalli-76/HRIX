import {
  AlertCircle,
  BadgeCheck,
  CircleCheck,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

/**
 * Trust states. A badge must never promise more than the check behind it.
 * The meanings below are proposed wording: align them with HRIX's real
 * verification process before launch.
 */
export type TrustState =
  | "registered-creator"
  | "verified-creator"
  | "verified-brand"
  | "verified-campaign"
  | "verification-pending"
  | "action-required";

interface TrustDefinition {
  label: string;
  meaning: string;
  tone: BadgeTone;
  icon: ReactNode;
}

const ICON_CLASS = "h-3.5 w-3.5";

export const TRUST_STATES: Record<TrustState, TrustDefinition> = {
  "registered-creator": {
    label: "Registered Creator",
    meaning: "Has an HRIX account and public profile. Identity not verified.",
    tone: "neutral",
    icon: <CircleCheck className={ICON_CLASS} />,
  },
  "verified-creator": {
    label: "Verified Creator",
    meaning: "HRIX has checked this creator's identity and linked platforms.",
    tone: "blue",
    icon: <BadgeCheck className={ICON_CLASS} />,
  },
  "verified-brand": {
    label: "Verified Brand",
    meaning: "HRIX has checked this business's details.",
    tone: "violet",
    icon: <ShieldCheck className={ICON_CLASS} />,
  },
  "verified-campaign": {
    label: "Verified Campaign",
    meaning: "HRIX has reviewed this campaign's brief and budget.",
    tone: "success",
    icon: <BadgeCheck className={ICON_CLASS} />,
  },
  "verification-pending": {
    label: "Verification Pending",
    meaning: "Submitted for review. No result yet.",
    tone: "warning",
    icon: <Clock3 className={ICON_CLASS} />,
  },
  "action-required": {
    label: "Action Required",
    meaning: "HRIX needs more information before this can be verified.",
    tone: "danger",
    icon: <AlertCircle className={ICON_CLASS} />,
  },
};

export function TrustBadge({
  state,
  className,
}: {
  state: TrustState;
  className?: string;
}) {
  const def = TRUST_STATES[state];
  return (
    <Badge tone={def.tone} icon={def.icon} title={def.meaning} className={className}>
      {def.label}
    </Badge>
  );
}
