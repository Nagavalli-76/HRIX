import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaignForCurrentBrand } from "@/lib/api/campaigns";
import { CampaignForm } from "@/components/brand/CampaignForm";

export const metadata: Metadata = { title: "Edit Campaign" };

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignForCurrentBrand(id);
  if (!campaign) notFound();

  return (
    <div>
      <h1 className="text-headline">Edit campaign</h1>
      <p className="mt-2 text-muted">Update the details creators see before applying.</p>
      <CampaignForm campaign={campaign} />
    </div>
  );
}