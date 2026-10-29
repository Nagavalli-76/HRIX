import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, MapPin, Users } from "lucide-react";
import { getCampaign } from "@/lib/api/campaigns";
import { Badge } from "@/components/ui/Badge";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { ApplyForm } from "@/components/creator/ApplyForm";
import { MatchScore } from "@/components/ui/MatchScore";
import { formatDate, formatInr } from "@/lib/format";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) return { title: "Campaign Not Found" };

  const title = `${campaign.title} · ${campaign.brandName} Campaign | HRIX`;
  const description = `${campaign.deliverables.join(", ")} collaboration with ${campaign.brandName} in ${campaign.city}. Budget: ${formatInr(campaign.budgetInr)}. Category: ${campaign.category}.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `/campaigns/${campaign.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://hrixofficial.in/campaigns/${campaign.slug}`,
      siteName: "HRIX",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CampaignDetailPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign) notFound();

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Campaigns", path: "/campaigns" },
    { name: campaign.title, path: `/campaigns/${campaign.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="container-page py-16 md:py-20">
      <section className="flex flex-col gap-6 border-b border-line/70 pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-muted">{campaign.brandName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-headline">{campaign.title}</h1>
            <TrustBadge state={campaign.trust} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-faint" aria-hidden />
              {campaign.city}
            </span>
            <Badge>{campaign.category}</Badge>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-faint" aria-hidden />
              {campaign.applicants} applicants
            </span>
          </div>
        </div>
        <ApplyForm campaignId={campaign.id} />
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="text-title">Brief</h2>
            <p className="mt-3 max-w-2xl text-muted">{campaign.summary}</p>
          </section>

          <section>
            <h2 className="text-title">Deliverables</h2>
            <ul className="mt-4 space-y-2">
              {campaign.deliverables.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-muted">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-violet" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-title">Platforms</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {campaign.platforms.map((platform) => (
                <Badge key={platform}>{platform}</Badge>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <GlassCard tone="raised" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-label text-muted">Budget</span>
              <span className="font-medium text-ink">{formatInr(campaign.budgetInr)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-label text-muted">Deadline</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <CalendarClock className="h-3.5 w-3.5 text-faint" aria-hidden />
                {formatDate(campaign.deadline)}
              </span>
            </div>
          </GlassCard>

          <GlassCard>
            <MatchScore
              score={87}
              factors={[
                { label: "Audience", value: 91 },
                { label: "Location", value: 80 },
                { label: "Niche", value: 88 },
              ]}
            />
          </GlassCard>
        </aside>
      </div>
    </div>
    </>
  );
}
