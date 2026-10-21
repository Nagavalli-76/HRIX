"use server";

import { createClient } from "@/lib/supabase/server";
import type { Category, City, Platform } from "@/types";

export interface CreatorOnboardingData {
  displayName: string;
  username: string;
  bio: string;
  platform: Platform;
  handle: string;
  category: Category;
  niche: string;
  city: City;
  followers: string;
  portfolioTitle: string;
  rate: string;
}

export interface BrandOnboardingData {
  businessName: string;
  website: string;
  description: string;
  industry: Category;
  city: City;
}

/**
 * Saves creator onboarding details to Supabase (creator_profiles, social_accounts, portfolio_items).
 */
export async function saveCreatorOnboarding(data: CreatorOnboardingData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User session not found. Please log in first." };
    }

    const followersCount = parseInt(data.followers, 10) || 0;
    const rateInr = parseFloat(data.rate) || 0;
    const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    const slug = `${cleanUsername || "creator"}-${user.id.slice(0, 6)}`;

    // 1. Update / Upsert Creator Profile
    const { data: creatorProfile, error: profileError } = await supabase
      .from("creator_profiles")
      .upsert(
        {
          user_id: user.id,
          username: cleanUsername || `user_${user.id.slice(0, 8)}`,
          slug,
          display_name: data.displayName.trim() || "Creator",
          bio: data.bio.trim(),
          category: data.category,
          niche: data.niche.trim(),
          city: data.city,
          follower_count: followersCount,
          starting_rate_inr: rateInr,
          trust: "registered-creator",
          availability: true,
          status: "active",
        },
        { onConflict: "user_id" }
      )
      .select("id")
      .single();

    if (profileError) {
      console.error("Error saving creator profile:", profileError);
      return { error: "Unable to save your creator profile. Please try again." };
    }

    const creatorId = creatorProfile.id;

    // 2. Add/Update Primary Social Account
    if (data.handle.trim()) {
      await supabase.from("social_accounts").upsert(
        {
          creator_id: creatorId,
          platform: data.platform,
          handle: data.handle.trim(),
          followers: followersCount,
          engagement_rate: 3.5,
        },
        { onConflict: "creator_id,platform" }
      );
    }

    // 3. Add initial Portfolio item if provided
    if (data.portfolioTitle.trim()) {
      await supabase.from("portfolio_items").insert({
        creator_id: creatorId,
        title: data.portfolioTitle.trim(),
        category: data.category,
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Exception in saveCreatorOnboarding:", err);
    return { error: "Unable to save your creator profile. Please try again." };
  }
}

/**
 * Saves brand onboarding details to Supabase (brand_profiles).
 */
export async function saveBrandOnboarding(data: BrandOnboardingData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "User session not found. Please log in first." };
    }

    const cleanName = data.businessName.trim() || "Brand";
    const slug = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${user.id.slice(0, 6)}`;

    const { error: brandError } = await supabase.from("brand_profiles").upsert(
      {
        user_id: user.id,
        brand_name: cleanName,
        slug,
        website: data.website.trim() || null,
        description: data.description.trim(),
        industry: data.industry,
        city: data.city,
        trust: "verification-pending",
        status: "active",
      },
      { onConflict: "user_id" }
    );

    if (brandError) {
      console.error("Error saving brand profile:", brandError);
      return { error: "Unable to save your brand profile. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception in saveBrandOnboarding:", err);
    return { error: "Unable to save your brand profile. Please try again." };
  }
}
