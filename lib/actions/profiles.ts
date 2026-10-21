"use server";

import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string, max: number) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length <= max ? value : null;
}

export async function updateCreatorProfile(formData: FormData) {
  const displayName = text(formData, "displayName", 120);
  const username = text(formData, "username", 50)?.toLowerCase().replace(/[^a-z0-9_]/g, "");
  const bio = text(formData, "bio", 2000);
  const startingRate = Number(formData.get("startingRate") ?? 0);
  if (!displayName || !username || bio === null || !Number.isFinite(startingRate) || startingRate < 0) return { error: "Enter valid profile details." };
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { error: "Authentication required." };
  const { error } = await supabase.from("creator_profiles").update({ display_name: displayName, username, bio, starting_rate_inr: startingRate }).eq("user_id", authData.user.id);
  if (error) {
    console.error("Error updating creator profile:", error);
    return { error: "Unable to save the changes. Please try again." };
  }
  return { success: true };
}

export async function updateBrandProfile(formData: FormData) {
  const brandName = text(formData, "brandName", 120);
  const website = text(formData, "website", 300);
  const description = text(formData, "description", 2000);
  if (!brandName || website === null || description === null || (website && !/^https?:\/\//i.test(website))) return { error: "Enter valid business details and an http(s) website URL." };
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { error: "Authentication required." };
  const { error } = await supabase.from("brand_profiles").update({ brand_name: brandName, website: website || null, description }).eq("user_id", authData.user.id);
  if (error) {
    console.error("Error updating brand profile:", error);
    return { error: "Unable to save the changes. Please try again." };
  }
  return { success: true };
}
