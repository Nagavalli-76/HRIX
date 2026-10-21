import type { Campaign } from "@/types";

/**
 * Live campaign directory. Empty until the backend is connected — no
 * placeholder or demo campaigns ship in this file.
 */
export const campaigns: Campaign[] = [];

export function getCampaignBySlug(slug: string) {
  return campaigns.find((campaign) => campaign.slug === slug);
}
