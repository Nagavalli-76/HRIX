export interface PlatformMetrics {
  registeredCreators: number;
  brands: number;
  campaigns: number;
}

/**
 * Platform-wide counts for admin/trust surfaces. Returns null until a real
 * analytics backend is connected — the homepage and admin overview must
 * never present fabricated platform statistics.
 */
export async function getPlatformMetrics(): Promise<PlatformMetrics | null> {
  return null;
}
