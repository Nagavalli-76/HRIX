import type { Application } from "@/types";
import { createClient } from "@/lib/supabase/server";

function mapApplication(row: any): Application {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    creatorId: row.creator_id,
    status: row.status,
    submittedOn: row.submitted_at,
    matchScore: row.match_score,
    creatorName: row.creator_profiles?.display_name,
    proposal: row.proposal ?? undefined,
    expectedPriceInr: row.expected_price == null ? undefined : Number(row.expected_price),
  };
}

/**
 * Applications service. Returns nothing until a real backend is connected —
 * no placeholder applications ship in the frontend.
 */
export async function listApplicationsForCreator(creatorId: string): Promise<Application[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaign_applications")
    .select("id, campaign_id, creator_id, status, submitted_at, match_score, proposal, expected_price, creator_profiles(display_name)")
    .eq("creator_id", creatorId)
    .order("submitted_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapApplication);
}

export async function listApplicationsForCampaign(campaignId: string): Promise<Application[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaign_applications")
    .select("id, campaign_id, creator_id, status, submitted_at, match_score, proposal, expected_price, creator_profiles(display_name)")
    .eq("campaign_id", campaignId)
    .order("submitted_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapApplication);
}
