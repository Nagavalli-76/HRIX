import type { Collaboration } from "@/types";
import { createClient } from "@/lib/supabase/server";

function mapCollaboration(row: any): Collaboration {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    creatorId: row.creator_id,
    status: row.status,
    timeline: (row.collaboration_events ?? []).map((event: any) => ({
      status: event.status,
      timestamp: event.created_at,
      note: event.note ?? undefined,
    })),
  };
}

/**
 * Collaborations service. Returns nothing until a real backend is connected —
 * no placeholder collaborations ship in the frontend.
 */
export async function listCollaborationsForCreator(creatorId: string): Promise<Collaboration[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collaborations")
    .select("id, campaign_id, creator_id, status, collaboration_events(status, note, created_at)")
    .eq("creator_id", creatorId)
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapCollaboration);
}

export async function listCollaborationsForCampaign(campaignId: string): Promise<Collaboration[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collaborations")
    .select("id, campaign_id, creator_id, status, collaboration_events(status, note, created_at)")
    .eq("campaign_id", campaignId)
    .order("updated_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map(mapCollaboration);
}
