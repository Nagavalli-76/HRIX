import type { Creator } from "@/types";

/**
 * Live creator directory. Empty until the backend (MongoDB/Supabase) is
 * connected — this file intentionally ships with no placeholder or demo
 * creators. `listCreators` / `getCreator` in lib/api/creators.ts are the
 * stable contract the real backend implementation should fulfil.
 */
export const creators: Creator[] = [];

export function getCreatorBySlug(slug: string) {
  return creators.find((creator) => creator.slug === slug);
}
