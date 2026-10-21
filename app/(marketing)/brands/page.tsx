import type { Metadata } from "next";
import { listBrands } from "@/lib/api/brands";
import { BrandCard } from "@/components/marketing/BrandCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "For Brands" };

export default async function BrandsPage() {
  const brands = await listBrands();

  return (
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
  );
}
