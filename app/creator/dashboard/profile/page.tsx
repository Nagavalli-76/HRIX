import type { Metadata } from "next";
import { getCreatorForUser } from "@/lib/api/creators";
import { getSession } from "@/lib/api/auth";
import { Avatar } from "@/components/ui/Avatar";
import { CreatorProfileForm } from "@/components/creator/CreatorProfileForm";
import { VerificationDocumentUpload } from "@/components/ui/VerificationDocumentUpload";

export const metadata: Metadata = { title: "Profile" };

export default async function CreatorProfileSettingsPage() {
  const session = await getSession();
  const creator = session ? await getCreatorForUser(session.id) : undefined;

  return (
    <div>
      <h1 className="text-headline">Profile</h1>
      <p className="mt-2 text-muted">This is what brands see on your public profile.</p>

      <div className="mt-8 flex items-center gap-4"><Avatar name={creator?.name ?? "Creator"} size="xl" /></div>
      <CreatorProfileForm creator={creator} />
      <div className="mt-8 max-w-xl rounded-lg border border-line bg-surface/60 p-5">
        <VerificationDocumentUpload entityType="creator" />
      </div>
    </div>
  );
}
