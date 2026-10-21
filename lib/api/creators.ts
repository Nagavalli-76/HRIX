import { createClient } from "@/lib/supabase/server";
import { getBrandDirectoryAccessStatus } from "@/lib/api/brand-access";
import type { Category, City, Creator } from "@/types";

export interface ListCreatorsParams {
  category?: Category;
  city?: City;
  query?: string;
}

export interface CreatorQueryOptions {
  bypassAuth?: boolean;
}

function mapCreatorRow(row: any): Creator {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    name: row.display_name,
    username: row.username,
    category: row.category,
    city: row.city,
    bio: row.bio ?? "",
    trust: row.trust,
    startingRateInr: Number(row.starting_rate_inr),
    joinedOn: row.created_at,
    platforms: (row.social_accounts ?? []).map((account: any) => ({
      platform: account.platform,
      handle: account.handle,
      followers: account.followers,
      engagementRate: Number(account.engagement_rate),
    })),
    portfolio: (row.portfolio_items ?? []).map((item: any) => ({
      id: item.id,
      title: item.title,
      brand: item.brand ?? undefined,
      category: item.category,
    })),
    collaborations: (row.collaborations ?? []).map((collaboration: any) => ({
      id: collaboration.id,
      campaignTitle: collaboration.campaigns?.title ?? "Campaign",
      brandName: collaboration.campaigns?.brand_profiles?.brand_name ?? "Brand",
      completedOn: collaboration.updated_at,
    })),
  };
}

/**
 * Lists registered creator profiles.
 * Strict security requirement:
 * - Creator directory is restricted to verified brands with an active paid entitlement or admins.
 * - Unauthorized requests return an empty list.
 * - Deduplication is enforced by unique user_id so each account appears exactly once,
 *   while preserving separate legitimate accounts with similar names.
 */
export async function listCreators(
  params: ListCreatorsParams = {},
  options: CreatorQueryOptions = {}
): Promise<Creator[]> {
  try {
    if (!options.bypassAuth) {
      const access = await getBrandDirectoryAccessStatus();
      if (!access.allowed) {
        return [];
      }
    }

    const { category, city, query } = params;
    const supabase = await createClient();

    let request = supabase
      .from("creator_profiles")
      .select(
        "id, user_id, slug, display_name, username, category, city, bio, trust, starting_rate_inr, created_at, social_accounts(id, platform, handle, followers, engagement_rate), portfolio_items(id, title, brand, category), collaborations(id, campaign_id, updated_at, campaigns(title, brand_profiles(brand_name)))"
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (category) request = request.eq("category", category);
    if (city) request = request.eq("city", city);
    if (query?.trim()) request = request.ilike("display_name", `%${query.trim()}%`);

    const { data, error } = await request;
    if (error) {
      console.error("Error loading creators:", error);
      return [];
    }

    // Deduplicate by stable user_id to prevent multiple entries for the same account
    // while strictly preserving separate accounts.
    const uniqueCreators = new Map<string, Creator>();
    for (const row of data ?? []) {
      if (row.user_id && !uniqueCreators.has(row.user_id)) {
        uniqueCreators.set(row.user_id, mapCreatorRow(row));
      }
    }

    return Array.from(uniqueCreators.values());
  } catch (error) {
    console.error("Error loading creators:", error);
    return [];
  }
}

/**
 * Retrieves a single creator profile by slug or ID.
 * Authorized for:
 * - Verified paying brands
 * - Administrators
 * - The creator themselves (matching auth user ID)
 *
 * Direct unauthorized access returns undefined.
 */
export async function getCreator(
  slugOrId: string,
  options: CreatorQueryOptions = {}
): Promise<Creator | undefined> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("creator_profiles")
      .select(
        "id, user_id, slug, display_name, username, category, city, bio, trust, starting_rate_inr, created_at, social_accounts(id, platform, handle, followers, engagement_rate), portfolio_items(id, title, brand, category), collaborations(id, campaign_id, updated_at, campaigns(title, brand_profiles(brand_name)))"
      )
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) {
      return undefined;
    }

    if (!options.bypassAuth) {
      const access = await getBrandDirectoryAccessStatus();
      if (!access.allowed) {
        // Check if the current authenticated user is the owner of this creator profile
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.id !== data.user_id) {
          // Unauthorized: do not expose creator profile details
          return undefined;
        }
      }
    }

    return mapCreatorRow(data);
  } catch (error) {
    console.error("Error loading creator profile:", error);
    return undefined;
  }
}

/**
 * Retrieves the creator profile for a specific authenticated user account.
 * Creators can always view and manage their own profile.
 */
export async function getCreatorForUser(userId: string): Promise<Creator | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("creator_profiles")
      .select(
        "id, user_id, slug, display_name, username, category, city, bio, trust, starting_rate_inr, created_at, social_accounts(id, platform, handle, followers, engagement_rate), portfolio_items(id, title, brand, category), collaborations(id, campaign_id, updated_at, campaigns(title, brand_profiles(brand_name)))"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapCreatorRow(data);
  } catch (error) {
    console.error("Error loading creator for user:", error);
    return undefined;
  }
}
