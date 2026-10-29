import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "Contact HRIX | Business Inquiries & Creator Partnerships",
  },
  description:
    "Get in touch with HRIX for brand partnerships, creator collaborations, digital marketing campaigns, web development, and business automation inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact HRIX | Business Inquiries & Creator Partnerships",
    description:
      "Get in touch with HRIX for brand partnerships, creator collaborations, digital marketing campaigns, web development, and business automation inquiries.",
    url: "https://hrixofficial.in/contact",
    siteName: "HRIX",
  },
};

export default function ContactPage() {
  const orgSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={[orgSchema, breadcrumbSchema]} />

      <div className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="violet" className="mb-4">
            Connect With HRIX
          </Badge>
          <h1 className="text-display">Let&apos;s Build Something Impactful</h1>
          <p className="mt-4 text-lg text-muted">
            Have questions about brand campaigns, creator onboarding, digital marketing,
            or custom business automation? Reach out directly to our team.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          {/* Direct Contact Information */}
          <div className="space-y-6">
            <GlassCard tone="accent" padded className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-ink">Direct Inquiries</h2>
                <p className="mt-2 text-sm text-muted">
                  For service proposals, campaign collaborations, and general inquiries,
                  email us anytime. We review inbound requests daily.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-line bg-surface/50 p-4">
                <Mail className="h-5 w-5 mt-0.5 text-violet shrink-0" aria-hidden />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-faint">
                    Official Email
                  </span>
                  <a
                    href="mailto:hrixofficial@gmail.com"
                    className="block font-medium text-ink hover:text-violet-soft transition-colors"
                  >
                    hrixofficial@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-line bg-surface/50 p-4">
                <Clock className="h-5 w-5 mt-0.5 text-violet shrink-0" aria-hidden />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-faint">
                    Response Window
                  </span>
                  <p className="text-sm text-muted">
                    Typically within 24 to 48 business hours (Mon – Sat)
                  </p>
                </div>
              </div>

              <div className="border-t border-line/60 pt-6">
                <h3 className="text-sm font-semibold text-ink">Looking for Platform Sign-Up?</h3>
                <p className="mt-1 text-xs text-muted">
                  Creators can register to build profiles and discover campaigns directly.
                  Brands can sign up to review creators and manage collaborations.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href="/register?role=creator" size="sm">
                    Creator Registration
                  </Button>
                  <Button href="/register?role=brand" variant="secondary" size="sm">
                    Brand Registration
                  </Button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 text-violet">
                <ShieldCheck className="h-5 w-5" aria-hidden />
                <h3 className="text-sm font-semibold text-ink">Verified Network Guarantee</h3>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                HRIX verifies creator accounts and brand profiles to maintain quality and protect
                collaboration standards across India and global markets.
              </p>
            </GlassCard>
          </div>

          {/* Quick Contact Form */}
          <GlassCard padded className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-ink">Send a Message</h2>
              <p className="mt-1 text-sm text-muted">
                Fill in your details and a brief message. We will connect with you promptly.
              </p>
            </div>

            <form
              action="mailto:hrixofficial@gmail.com"
              method="get"
              encType="text/plain"
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-ink">
                  Your Full Name
                </label>
                <input
                  id="name"
                  name="subject"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1.5 w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-ink">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="mt-1.5 w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-xs font-medium text-ink">
                    Primary Interest
                  </label>
                  <select
                    id="service"
                    defaultValue="General Inquiry"
                    className="mt-1.5 w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Branding & Identity">Branding & Identity</option>
                    <option value="Influencer Marketing">Influencer Marketing</option>
                    <option value="Digital Marketing & Ads">Digital Marketing & Ads</option>
                    <option value="Social Media Visibility">Social Media Visibility</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Business Systems Automation">Business Automation</option>
                    <option value="Website Design & Development">Website Development</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="body" className="block text-xs font-medium text-ink">
                  How can we help you?
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={5}
                  required
                  placeholder="Briefly describe your business, timeline, and goals..."
                  className="mt-1.5 w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Message via Email
              </Button>

              <p className="text-center text-xs text-faint">
                By submitting, your default email client will draft a direct email to{" "}
                <span className="text-muted">hrixofficial@gmail.com</span>.
              </p>
            </form>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
