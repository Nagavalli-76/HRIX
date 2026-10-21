import { cn } from "@/lib/cn";

export interface MatchFactor {
  label: string;
  /** 0 to 100. */
  value: number;
}

export interface MatchScoreProps {
  /** 0 to 100. */
  score: number;
  factors?: MatchFactor[];
  className?: string;
}

/**
 * Recommended-match indicator. Always phrased as a relevance signal, never a
 * scientific guarantee — see the copy below and the "Recommended Match" label.
 */
export function MatchScore({ score, factors, className }: MatchScoreProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center gap-4">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          role="img"
          aria-label={`Recommended match: ${clamped} percent`}
        >
          <circle cx="36" cy="36" r={radius} fill="none" stroke="currentColor" className="text-line" strokeWidth="6" />
          <circle
            cx="36"
            cy="36"
            r={radius}
            fill="none"
            stroke="url(#hrix-match-ring)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 36 36)"
          />
          <defs>
            <linearGradient id="hrix-match-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#4F7CFF" />
            </linearGradient>
          </defs>
          <text
            x="36"
            y="41"
            textAnchor="middle"
            className="fill-ink text-[1rem] font-semibold"
          >
            {clamped}%
          </text>
        </svg>
        <div>
          <p className="font-medium text-ink">Recommended Match</p>
          <p className="text-sm text-faint">Based on campaign relevance</p>
        </div>
      </div>

      {factors && factors.length > 0 ? (
        <ul className="space-y-2.5">
          {factors.map((factor) => (
            <li key={factor.label} className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-sm text-muted">{factor.label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-violet to-blue"
                  style={{ width: `${Math.min(100, Math.max(0, factor.value))}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-sm tabular-nums text-faint">
                {factor.value}%
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
