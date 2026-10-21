import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

/**
 * Illustrative mockup of a creator profile card for the "Why creators join"
 * section. Intentionally not sourced from live creator data — this is a
 * static example of the profile layout, not a real HRIX creator.
 */
export function CreatorProfilePreview() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Avatar name="Creator" size="lg" />
        <div>
          <p className="font-medium text-ink">Your creator profile</p>
          <p className="text-sm text-faint">Profile preview — not a real account</p>
        </div>
        <Badge tone="neutral" className="ml-auto">
          Example
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge>Your category</Badge>
        <Badge>Your city</Badge>
      </div>

      <p className="text-sm text-muted">
        Your bio, platforms and positioning appear here — written by you, not
        generated for you.
      </p>

      <div className="grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
        <div>
          <p className="text-faint">Platforms</p>
          <p className="font-medium text-ink">Added by you</p>
        </div>
        <div>
          <p className="text-faint">Starting rate</p>
          <p className="font-medium text-ink">Set by you</p>
        </div>
      </div>
    </div>
  );
}
