"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { submitVerificationDocument } from "@/lib/actions/verification";
import { Button } from "@/components/ui/Button";

export function VerificationDocumentUpload({ entityType }: { entityType: "creator" | "brand" }) {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  async function upload(file: File) {
    setStatus("");
    setProgress(10);
    setIsUploading(true);
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("Documents must be 10 MB or smaller.");
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        throw new Error("Upload a PDF or image document.");
      }

      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error("Authentication required.");
      const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${authData.user.id}/verification-${crypto.randomUUID()}.${extension}`;
      setProgress(40);
      const { error } = await supabase.storage.from("verifications").upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw new Error(error.message);
      setProgress(80);
      const result = await submitVerificationDocument(entityType, path);
      if ("error" in result) throw new Error(result.error ?? "Unable to submit document.");
      setProgress(100);
      setStatus("Document submitted for review.");
      router.refresh();
    } catch (error) {
      setProgress(0);
      setStatus(error instanceof Error ? error.message : "Unable to upload document.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-ink">Verification document</p>
        <p className="mt-1 text-sm text-faint">PDF or image, up to 10 MB. Documents remain private.</p>
      </div>
      <input
        type="file"
        accept="image/*,application/pdf"
        disabled={isUploading}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.currentTarget.value = "";
        }}
        className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-raised file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
      />
      {isUploading ? (
        <div role="progressbar" aria-valuenow={progress} className="h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-violet transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {status ? <p role={status.includes("submitted") ? "status" : "alert"} className={`text-sm ${status.includes("submitted") ? "text-success" : "text-danger"}`}>{status}</p> : null}
      {isUploading ? <Button type="button" size="sm" loading disabled>Uploading</Button> : null}
    </div>
  );
}
