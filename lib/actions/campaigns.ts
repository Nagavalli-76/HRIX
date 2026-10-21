"use server";

import { createClient } from "@/lib/supabase/server";
import type { Category, City, Platform } from "@/types";

class UserFacingError extends Error {}

const categories: Category[] = [
  "Fashion", "Food", "Fitness", "Education", "Technology", "Beauty",
  "Travel", "Lifestyle", "Gaming", "Finance", "Real Estate",
];
const cities: Array<City | "Remote"> = [
  "Hyderabad", "Kakinada", "Rajahmundry", "Vijayawada", "Visakhapatnam",
  "Bengaluru", "Chennai", "Mumbai", "Remote",
];
const platforms: Platform[] = ["Instagram", "YouTube", "X", "LinkedIn"];

function readCampaignForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const city = String(formData.get("city") ?? "");
  const budget = Number(formData.get("budget") ?? 0);
  const deadline = String(formData.get("deadline") ?? "");
  const deliverables = String(formData.get("deliverables") ?? "")
    .split("\n").map((value) => value.trim()).filter(Boolean);
  const selectedPlatforms = formData.getAll("platforms").map(String);

  if (title.length < 3 || title.length > 120) return { error: "Title must be between 3 and 120 characters." };
  if (summary.length < 20 || summary.length > 2000) return { error: "Summary must be between 20 and 2,000 characters." };
  if (!categories.includes(category as Category)) return { error: "Choose a valid category." };
  if (!cities.includes(city as City | "Remote")) return { error: "Choose a valid city." };
  if (!Number.isFinite(budget) || budget <= 0) return { error: "Budget must be greater than zero." };
  if (!deadline || Number.isNaN(Date.parse(deadline))) return { error: "Choose a valid deadline." };
  if (new Date(`${deadline}T23:59:59`) < new Date()) return { error: "Deadline must be in the future." };
  if (deliverables.length === 0 || deliverables.length > 20) return { error: "Add between 1 and 20 deliverables." };
  if (selectedPlatforms.length === 0 || selectedPlatforms.some((platform) => !platforms.includes(platform as Platform))) {
    return { error: "Choose at least one valid platform." };
  }

  return {
    value: {
      title,
      summary,
      category: category as Category,
      city: city as City | "Remote",
      budget_inr: budget,
      deadline,
      deliverables,
      platforms: selectedPlatforms as Platform[],
    },
  };
}

function makeSlug(title: string, suffix: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
  return `${base || "campaign"}-${suffix}`;
}

async function currentBrand() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new UserFacingError("Authentication required.");
  const { data: brand, error } = await supabase
    .from("brand_profiles")
    .select("id")
    .eq("user_id", authData.user.id)
    .single();
  if (error || !brand) throw new UserFacingError("Only a brand owner can manage campaigns.");
  return { supabase, brandId: brand.id };
}

export async function createCampaign(formData: FormData) {
  const parsed = readCampaignForm(formData);
  if ("error" in parsed) return parsed;

  try {
    const { supabase, brandId } = await currentBrand();
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        ...parsed.value,
        brand_id: brandId,
        slug: makeSlug(parsed.value.title, crypto.randomUUID().slice(0, 8)),
      })
      .select("slug")
      .single();
    if (error) throw new Error("Unable to create campaign.");
    return { success: true, slug: data.slug };
  } catch (error) {
    if (!(error instanceof UserFacingError)) console.error("Error creating campaign:", error);
    return { error: error instanceof UserFacingError ? error.message : "Unable to create campaign." };
  }
}

export async function updateCampaign(campaignId: string, formData: FormData) {
  if (!campaignId) return { error: "Campaign is required." };
  const parsed = readCampaignForm(formData);
  if ("error" in parsed) return parsed;

  try {
    const { supabase, brandId } = await currentBrand();
    const { data, error } = await supabase
      .from("campaigns")
      .update(parsed.value)
      .eq("id", campaignId)
      .eq("brand_id", brandId)
      .select("slug")
      .single();
    if (error || !data) throw new UserFacingError("Campaign not found or not owned by you.");
    return { success: true, slug: data.slug };
  } catch (error) {
    if (!(error instanceof UserFacingError)) console.error("Error updating campaign:", error);
    return { error: error instanceof UserFacingError ? error.message : "Unable to update campaign." };
  }
}
