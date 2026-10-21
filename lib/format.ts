/** Shared display formatting so numbers read consistently across the app. */

const inrCompact = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const inrFull = new Intl.NumberFormat("en-IN");

export function formatInr(amount: number, compact = false): string {
  return `₹${(compact ? inrCompact : inrFull).format(amount)}`;
}

export function formatFollowers(count: number): string {
  return inrCompact.format(count);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeShort(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return `${Math.max(diffMin, 1)}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}
