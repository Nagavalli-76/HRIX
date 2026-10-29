import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getBrand } from "@/lib/api/brands";
import { listCampaigns } from "@/lib/api/campaigns";
import { Badge } from "@/components/ui/Badge";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: "Brand Not Found" };

  const title = `${brand.name} · Verified Brand Profile | HRIX`;
  const description = `Explore ${brand.name} (${brand.industry}) based in ${brand.city}. Discover active campaigns and creator collaboration opportunities on HRIX.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/brands/${brand.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hrixofficial.in/brands/${brand.slug}`,
      siteName: "HRIX",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function BrandProfilePage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const allCampaigns = await listCampaigns();
  const brandCampaigns = allCampaigns.filter((campaign) => campaign.brandSlug === brand.slug);

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Brands", path: "/brands" },
    { name: brand.name, path: `/brands/${brand.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="container-page py-16 md:py-20">
      <section className="flex flex-col gap-6 border-b border-line/70 pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-headline">{brand.name}</h1>
            <TrustBadge state={brand.trust} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-faint" aria-hidden />
              {brand.city}
            </span>
            <Badge>{brand.industry}</Badge>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-title">About</h2>
            <p className="mt-3 max-w-2xl text-muted">{brand.description}</p>
            {brand.website ? (
              <a
                href={brand.website}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-blue-soft underline underline-offset-4"
              >
                {brand.website.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </section>

          <section>
            <h2 className="text-title">Campaigns from {brand.name}</h2>
            {brandCampaigns.length > 0 ? (
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {brandCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-faint">No campaigns listed yet.</p>
            )}
          </section>
        </div>

        <aside>
          <GlassCard tone="raised" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-label text-muted">Active campaigns</span>
              <span className="font-medium text-ink">{brand.activeCampaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label text-muted">Completed campaigns</span>
              <span className="font-medium text-ink">{brand.completedCampaigns}</span>
            </div>
          </GlassCard>
        </aside>
      </div>
    </div>
    </>
  );
}
