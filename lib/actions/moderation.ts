"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendModerationEmail } from "@/lib/email";
import type { ApplicationStatus, CampaignStatus, TrustState } from "@/types";

type TargetType = "creator" | "brand" | "campaign" | "application";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("Authentication required.");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", authData.user.id)
    .maybeSingle();
  if (profileError) throw new Error("Unable to fetch profile.");
  if (profile?.role !== "admin") throw new Error("Admin authorization required.");
  // Ensure the admin email matches the authorized address
  const authorizedEmail = process.env.HRIX_ADMIN_EMAIL || "hrixofficial@gmail.com";
  if (profile?.email?.toLowerCase() !== authorizedEmail.toLowerCase()) {
    throw new Error("Admin email not authorized.");
  }
  return { supabase, userId: authData.user.id };
}

const trustStates: TrustState[] = [
  "registered-creator", "verified-creator", "verified-brand",
  "verified-campaign", "verification-pending", "action-required",
];
const campaignStatuses: CampaignStatus[] = ["open", "closing-soon", "closed"];
const applicationStatuses: ApplicationStatus[] = [
  "submitted", "shortlisted", "accepted", "rejected", "withdrawn",
];

export async function moderateRecord(
  targetType: TargetType,
  targetId: string,
  value: string,
  reason?: string,
) {
  if (!targetId) return { error: "A moderation target is required." };
  try {
    const { supabase, userId } = await requireAdmin();
    let table: "creator_profiles" | "brand_profiles" | "campaigns" | "campaign_applications";
    let update: Record<string, string>;

    if (targetType === "creator" || targetType === "brand") {
      if (!trustStates.includes(value as TrustState)) return { error: "Invalid verification state." };
      table = targetType === "creator" ? "creator_profiles" : "brand_profiles";
      update = { trust: value };
    } else if (targetType === "campaign") {
      if (!campaignStatuses.includes(value as CampaignStatus)) return { error: "Invalid campaign status." };
      table = "campaigns";
      update = { status: value };
    } else {
      if (!applicationStatuses.includes(value as ApplicationStatus)) return { error: "Invalid application status." };
      table = "campaign_applications";
      update = { status: value };
    }

    const { error } = await supabase.from(table).update(update).eq("id", targetId);
    if (error) throw new Error("Unable to update moderation state.");

    const { error: auditError } = await supabase.from("admin_audit_logs").insert({
      admin_user_id: userId,
      action: `moderate_${targetType}`,
      target_type: targetType,
      target_id: targetId,
      details: update,
    });
    if (auditError) throw new Error("Unable to record moderation audit log.");

    // Send email notification for creator/brand trust changes
    // This runs AFTER successful DB update and audit log write.
    let emailStatus: "sent" | "skipped" | "failed" = "skipped";
    if (targetType === "creator" || targetType === "brand") {
      const isApproval = value === "verified-creator" || value === "verified-brand";
      const isActionRequired = value === "action-required";

      if (isApproval || isActionRequired) {
        // Look up the user's email from the profile table via the target record
        const userIdCol = "user_id";
        const { data: targetRow } = await supabase
          .from(table)
          .select(userIdCol)
          .eq("id", targetId)
          .maybeSingle();

        if (targetRow?.user_id) {
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", targetRow.user_id)
            .maybeSingle();

          if (userProfile?.email) {
            emailStatus = await sendModerationEmail({
              to: userProfile.email,
              userName: userProfile.full_name || "User",
              accountType: targetType as "creator" | "brand",
              decision: isApproval ? "approved" : "action-required",
              reason: isActionRequired ? reason : undefined,
            });
          }
        }
      }
    }

    revalidatePath(`/admin/${targetType === "application" ? "applications" : `${targetType}s`}`);
    return { success: true, emailStatus };
  } catch (error) {
    console.error("Error updating moderation state:", error);
    return { error: "Unable to update moderation state." };
  }
}
