import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="max-w-2xl">
        <h1 className="text-headline">About HRIX</h1>
        <p className="mt-6 text-lg text-muted">
          HRIX is the creator × brand growth network — a place for creators to
          build a professional presence and for brands to find the right
          creators to work with.
        </p>
        <p className="mt-4 text-muted">
          We connect discovery, matching, collaboration, content, measurement
          and payment into one platform, so both sides can focus on the work
          instead of the logistics around it.
        </p>
      </div>
    </div>
  );
}
