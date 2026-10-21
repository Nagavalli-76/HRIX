import type { MetadataRoute } from "next";
import { creators } from "@/data/creators";
import { campaigns } from "@/data/campaigns";
import { brands } from "@/data/brands";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/creators",
    "/campaigns",
    "/brands",
    "/how-it-works",
    "/pricing",
    "/about",
    "/brand-system",
    "/login",
    "/register",
  ].map((path) => ({ url: `${BASE_URL}${path}` }));

  const creatorRoutes = creators.map((c) => ({ url: `${BASE_URL}/creators/${c.slug}` }));
  const campaignRoutes = campaigns.map((c) => ({ url: `${BASE_URL}/campaigns/${c.slug}` }));
  const brandRoutes = brands.map((b) => ({ url: `${BASE_URL}/brands/${b.slug}` }));

  return [...staticRoutes, ...creatorRoutes, ...campaignRoutes, ...brandRoutes];
}
