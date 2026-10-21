import { createClient } from "@/lib/supabase/server";
import type { Brand } from "@/types";

export async function listBrands(): Promise<Brand[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brand_profiles")
      .select("id, slug, brand_name, industry, city, description, website, trust, campaigns(status)")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error loading brands:", error);
      return [];
    }

    return (data ?? []).map((row: any) => {
      const campaigns = row.campaigns ?? [];
      return {
        id: row.id,
        slug: row.slug,
        name: row.brand_name,
        industry: row.industry,
        city: row.city,
        description: row.description ?? "",
        website: row.website ?? undefined,
        trust: row.trust,
        activeCampaigns: campaigns.filter((campaign: any) => campaign.status !== "closed").length,
        completedCampaigns: campaigns.filter((campaign: any) => campaign.status === "closed").length,
      };
    });
  } catch (error) {
    console.error("Error loading brands:", error);
    return [];
  }
}

export async function getBrand(slug: string): Promise<Brand | undefined> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brand_profiles")
      .select("id, slug, brand_name, industry, city, description, website, trust, campaigns(status)")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();
    if (error) {
      console.error("Error loading brand:", error);
      return undefined;
    }
    if (!data) return undefined;

    const campaigns = (data as any).campaigns ?? [];
    return {
      id: data.id,
      slug: data.slug,
      name: data.brand_name,
      industry: data.industry,
      city: data.city,
      description: data.description ?? "",
      website: data.website ?? undefined,
      trust: data.trust,
      activeCampaigns: campaigns.filter((campaign: any) => campaign.status !== "closed").length,
      completedCampaigns: campaigns.filter((campaign: any) => campaign.status === "closed").length,
    };
  } catch (error) {
    console.error("Error loading brand:", error);
    return undefined;
  }
}

export async function getBrandForUser(userId: string): Promise<Brand | undefined> {
  const supabase = await createClient();
  const { data } = await supabase.from("brand_profiles").select("slug").eq("user_id", userId).maybeSingle();
  return data?.slug ? getBrand(data.slug) : undefined;
}
