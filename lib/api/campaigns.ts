import { createClient } from "@/lib/supabase/server";
import type { Campaign, Category, City, Platform } from "@/types";

export interface ListCampaignsParams {
  category?: Category;
  city?: City | "Remote";
  platform?: Platform;
}

export async function listCampaigns(params: ListCampaignsParams = {}): Promise<Campaign[]> {
  const { category, city, platform } = params;

  try {
    const supabase = await createClient();
    let query = supabase
      .from("campaigns")
      .select("id, slug, title, summary, category, city, budget_inr, deliverables, platforms, deadline, status, trust, brand_profiles(brand_name, slug), campaign_applications(count)")
      .order("created_at", { ascending: false });

    if (category) query = query.eq("category", category);
    if (city) query = query.eq("city", city);
    if (platform) query = query.contains("platforms", [platform]);

    const { data, error } = await query;
    if (!error && data) {
      return data.map((campaign: any) => ({
        id: campaign.id,
        slug: campaign.slug,
        title: campaign.title,
        summary: campaign.summary,
        category: campaign.category,
        city: campaign.city,
        budgetInr: Number(campaign.budget_inr),
        deliverables: campaign.deliverables ?? [],
        platforms: campaign.platforms ?? [],
        deadline: campaign.deadline,
        status: campaign.status,
        trust: campaign.trust,
        brandName: campaign.brand_profiles?.brand_name ?? "HRIX brand",
        brandSlug: campaign.brand_profiles?.slug ?? "",
        applicants: campaign.campaign_applications?.[0]?.count ?? 0,
      }));
    }
    if (error) {
      console.error("Error loading campaigns:", error);
      return [];
    }
  } catch (error) {
    console.error("Error loading campaigns:", error);
  }
  return [];
}

export async function getCampaign(slug: string): Promise<Campaign | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, slug, title, summary, category, city, budget_inr, deliverables, platforms, deadline, status, trust, brand_profiles(brand_name, slug), campaign_applications(count)")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        category: data.category,
        city: data.city,
        budgetInr: Number(data.budget_inr),
        deliverables: data.deliverables ?? [],
        platforms: data.platforms ?? [],
        deadline: data.deadline,
        status: data.status,
        trust: data.trust,
        brandName: (data.brand_profiles as any)?.brand_name ?? "HRIX brand",
        brandSlug: (data.brand_profiles as any)?.slug ?? "",
        applicants: (data.campaign_applications as any)?.[0]?.count ?? 0,
      };
    }
  } catch (error) {
    console.error("Error loading campaign:", error);
  }
  return undefined;
}

export async function listCampaignsForCurrentBrand(): Promise<Campaign[]> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data: brand, error } = await supabase
    .from("brand_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (error) {
    console.error("Error loading brand profile:", error);
    throw new Error("Unable to load the brand profile.");
  }
  if (!brand) return [];

  const { data, error: campaignsError } = await supabase
    .from("campaigns")
    .select("id, slug, title, summary, category, city, budget_inr, deliverables, platforms, deadline, status, trust, brand_profiles(brand_name, slug), campaign_applications(count)")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });
  if (campaignsError) {
    console.error("Error loading brand campaigns:", campaignsError);
    throw new Error("Unable to load brand campaigns.");
  }

  return (data ?? []).map((campaign: any) => ({
    id: campaign.id,
    slug: campaign.slug,
    title: campaign.title,
    summary: campaign.summary,
    category: campaign.category,
    city: campaign.city,
    budgetInr: Number(campaign.budget_inr),
    deliverables: campaign.deliverables ?? [],
    platforms: campaign.platforms ?? [],
    deadline: campaign.deadline,
    status: campaign.status,
    trust: campaign.trust,
    brandName: campaign.brand_profiles?.brand_name ?? "HRIX brand",
    brandSlug: campaign.brand_profiles?.slug ?? "",
    applicants: campaign.campaign_applications?.[0]?.count ?? 0,
  }));
}

export async function getCampaignForCurrentBrand(campaignId: string): Promise<Campaign | undefined> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return undefined;

  const { data: brand, error: brandError } = await supabase
    .from("brand_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (brandError || !brand) return undefined;

  const { data, error } = await supabase
    .from("campaigns")
    .select("id, slug, title, summary, category, city, budget_inr, deliverables, platforms, deadline, status, trust, brand_profiles(brand_name, slug), campaign_applications(count)")
    .eq("id", campaignId)
    .eq("brand_id", brand.id)
    .maybeSingle();
  if (error || !data) return undefined;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    category: data.category,
    city: data.city,
    budgetInr: Number(data.budget_inr),
    deliverables: data.deliverables ?? [],
    platforms: data.platforms ?? [],
    deadline: data.deadline,
    status: data.status,
    trust: data.trust,
    brandName: (data.brand_profiles as any)?.brand_name ?? "HRIX brand",
    brandSlug: (data.brand_profiles as any)?.slug ?? "",
    applicants: (data.campaign_applications as any)?.[0]?.count ?? 0,
  };
}
