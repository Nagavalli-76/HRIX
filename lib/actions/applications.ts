"use server";

import { createClient } from "@/lib/supabase/server";

class UserFacingError extends Error {}

function validProposal(formData: FormData) {
  const proposal = String(formData.get("proposal") ?? "").trim();
  const expectedPrice = Number(formData.get("expectedPrice") ?? 0);
  if (proposal.length < 20 || proposal.length > 3000) return { error: "Proposal must be between 20 and 3,000 characters." };
  if (!Number.isFinite(expectedPrice) || expectedPrice < 0) return { error: "Expected price must be zero or greater." };
  return { value: { proposal, expected_price: expectedPrice } };
}

async function currentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Authentication required.");
  return { supabase, userId: data.user.id };
}

async function notify(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, kind: string, title: string, body: string, link: string) {
  await supabase.from("notifications").insert({ user_id: userId, kind, title, body, link });
}

export async function applyToCampaign(campaignId: string, formData: FormData) {
  const parsed = validProposal(formData);
  if ("error" in parsed) return parsed;
  try {
    const { supabase, userId } = await currentUser();
    const { data: creator, error: creatorError } = await supabase.from("creator_profiles").select("id, display_name").eq("user_id", userId).single();
    if (creatorError || !creator) throw new UserFacingError("Complete your creator profile before applying.");
    const { data: campaign, error: campaignError } = await supabase.from("campaigns").select("id, title, slug, brand_id, deadline, status, brand_profiles(user_id)").eq("id", campaignId).single();
    if (campaignError || !campaign || campaign.status === "closed" || new Date(campaign.deadline) < new Date()) throw new UserFacingError("This campaign is no longer accepting applications.");

    const { data: application, error } = await supabase.from("campaign_applications").insert({ campaign_id: campaignId, creator_id: creator.id, ...parsed.value }).select("id").single();
    if (error) {
      if (error.code === "23505") throw new UserFacingError("You have already applied to this campaign.");
      throw new Error("Unable to submit application.");
    }
    const brandUserId = (campaign.brand_profiles as { user_id?: string } | null)?.user_id;
    if (brandUserId) await notify(supabase, brandUserId, "application-submitted", "New campaign application", `${creator.display_name} applied to ${campaign.title}.`, `/brand/dashboard/applications`);
    return { success: true, applicationId: application.id };
  } catch (error) {
    if (!(error instanceof UserFacingError)) console.error("Error submitting application:", error);
    return { error: error instanceof UserFacingError ? error.message : "Unable to submit application." };
  }
}

export async function withdrawApplication(applicationId: string) {
  try {
    const { supabase, userId } = await currentUser();
    const { data: creator } = await supabase.from("creator_profiles").select("id, display_name").eq("user_id", userId).single();
    if (!creator) throw new UserFacingError("Creator profile not found.");
    const { data: application, error } = await supabase.from("campaign_applications").update({ status: "withdrawn" }).eq("id", applicationId).eq("creator_id", creator.id).in("status", ["submitted", "shortlisted"]).select("campaign_id, campaigns(title, brand_profiles(user_id))").single();
    if (error || !application) throw new UserFacingError("This application cannot be withdrawn.");
    const campaign = application.campaigns as { title?: string; brand_profiles?: { user_id?: string } | null } | null;
    if (campaign?.brand_profiles?.user_id) await notify(supabase, campaign.brand_profiles.user_id, "application-withdrawn", "Application withdrawn", `${creator.display_name} withdrew their application for ${campaign.title ?? "your campaign"}.`, `/brand/dashboard/applications`);
    return { success: true };
  } catch (error) {
    if (!(error instanceof UserFacingError)) console.error("Error withdrawing application:", error);
    return { error: error instanceof UserFacingError ? error.message : "Unable to withdraw application." };
  }
}

export async function reviewApplication(applicationId: string, decision: "accepted" | "rejected") {
  try {
    const { supabase, userId } = await currentUser();
    const { data: application, error: applicationError } = await supabase.from("campaign_applications").select("id, campaign_id, creator_id, status, campaigns(title, brand_id, brand_profiles(user_id))").eq("id", applicationId).single();
    if (applicationError || !application) throw new UserFacingError("Application not found.");
    const campaign = application.campaigns as unknown as { title: string; brand_id: string; brand_profiles?: { user_id?: string } | null };
    if (campaign.brand_profiles?.user_id !== userId) throw new UserFacingError("You are not allowed to review this application.");
    if (!["submitted", "shortlisted"].includes(application.status)) throw new UserFacingError("This application is no longer reviewable.");

    const { error: updateError } = await supabase.from("campaign_applications").update({ status: decision }).eq("id", applicationId).in("status", ["submitted", "shortlisted"]);
    if (updateError) throw new Error("Unable to review application.");
    const { data: creator } = await supabase.from("creator_profiles").select("user_id, display_name").eq("id", application.creator_id).single();
    if (!creator) throw new UserFacingError("Creator profile not found.");

    if (decision === "accepted") {
      const { error: collaborationError } = await supabase.from("collaborations").upsert({ campaign_id: application.campaign_id, creator_id: application.creator_id, application_id: application.id, status: "accepted" }, { onConflict: "campaign_id,creator_id" });
      if (collaborationError) throw new Error("Unable to review application.");
      await supabase.from("collaboration_events").insert({ collaboration_id: (await supabase.from("collaborations").select("id").eq("application_id", application.id).single()).data?.id, status: "accepted", note: "Application accepted" });
    }
    await notify(supabase, creator.user_id, decision === "accepted" ? "application-accepted" : "application-rejected", decision === "accepted" ? "Application accepted" : "Application update", decision === "accepted" ? `Your application for ${campaign.title} was accepted.` : `Your application for ${campaign.title} was not selected.`, `/creator/dashboard/applications`);
    return { success: true };
  } catch (error) {
    if (!(error instanceof UserFacingError)) console.error("Error reviewing application:", error);
    return { error: error instanceof UserFacingError ? error.message : "Unable to review application." };
  }
}
