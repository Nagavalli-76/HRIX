"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitVerificationDocument(entityType: "creator" | "brand", path: string) {
  if (!path || path.split("/").length < 3) return { error: "Invalid verification document path." };

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return { error: "Authentication required." };

  const table = entityType === "creator" ? "creator_profiles" : "brand_profiles";
  const { data: profile, error: profileError } = await supabase
    .from(table)
    .select("id")
    .eq("user_id", authData.user.id)
    .maybeSingle();
  if (profileError || !profile) return { error: "Complete your profile before submitting verification." };

  const { error } = await supabase.from("verification_requests").insert({
    user_id: authData.user.id,
    entity_type: entityType,
    entity_id: profile.id,
    document_urls: [path],
  });
  if (error) {
    console.error("Error submitting verification document:", error);
    return { error: "Unable to submit the verification document. Please try again." };
  }

  revalidatePath(entityType === "creator" ? "/creator/dashboard/profile" : "/brand/dashboard/profile");
  return { success: true };
}
