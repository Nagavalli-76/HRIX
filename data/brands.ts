import type { Brand } from "@/types";

/**
 * Live brand directory. Empty until the backend is connected — no
 * placeholder or demo brands ship in this file.
 */
export const brands: Brand[] = [];

export function getBrandBySlug(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}
