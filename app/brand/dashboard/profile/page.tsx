import type { Metadata } from "next";
import { getBrandForUser } from "@/lib/api/brands";
import { getSession } from "@/lib/api/auth";
import { BrandProfileForm } from "@/components/brand/BrandProfileForm";
import { VerificationDocumentUpload } from "@/components/ui/VerificationDocumentUpload";

export const metadata: Metadata = { title: "Business Profile" };

export default async function BrandProfileSettingsPage() {
  const session = await getSession();
  const brand = session ? await getBrandForUser(session.id) : undefined;

  return (
    <div>
      <h1 className="text-headline">Business profile</h1>
      <p className="mt-2 text-muted">This is what creators see before applying to your campaigns.</p>

      <BrandProfileForm brand={brand} />
      <div className="mt-8 max-w-xl rounded-lg border border-line bg-surface/60 p-5">
        <VerificationDocumentUpload entityType="brand" />
      </div>
    </div>
  );
}
