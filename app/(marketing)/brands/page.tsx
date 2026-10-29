import type { Metadata } from "next";
import { listBrands } from "@/lib/api/brands";
import { BrandCard } from "@/components/marketing/BrandCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Brands & Campaign Partners · HRIX",
  description:
    "Discover brands collaborating with verified creators on HRIX. Launch targeted influencer campaigns and manage collaborations effortlessly.",
  alternates: {
    canonical: "/brands",
  },
  openGraph: {
    title: "Brands & Campaign Partners · HRIX",
    description:
      "Discover brands collaborating with verified creators on HRIX. Launch targeted influencer campaigns and manage collaborations effortlessly.",
    url: "https://hrixofficial.in/brands",
    siteName: "HRIX",
  },
};

export default async function BrandsPage() {
  const brands = await listBrands();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Brands", path: "/brands" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="container-page py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-headline">Brands on HRIX</h1>
          <p className="mt-4 max-w-xl text-muted">
            Find creators who fit your campaign, and manage collaborations
            from one dashboard.
          </p>
        </div>
        <Button href="/register?role=brand">Launch a campaign</Button>
      </div>

      {brands.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No brands to show yet" body="Brands using HRIX will appear here once they are live." />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
      )}
    </div>
    </>
  );
}
