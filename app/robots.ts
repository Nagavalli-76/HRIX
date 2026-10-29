import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hrixofficial.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/creator/dashboard",
          "/creator/dashboard/",
          "/creator/onboarding",
          "/creator/onboarding/",
          "/brand/dashboard",
          "/brand/dashboard/",
          "/api/",
          "/auth/",
          "/login",
          "/register",
          "/forgot-password",
          "/update-password",
          "/auth-error",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
