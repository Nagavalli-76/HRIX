import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { AmbientBackground } from "@/components/marketing/AmbientBackground";
import { HrixCursor } from "@/components/ui/HrixCursor";

// Display: Bricolage Grotesque, with its width axis so headlines can run
// condensed and heavy. Body: Instrument Sans, quiet and highly legible.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["wdth"],
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://hrixofficial.in"
  ),
  title: {
    default: "HRIX | Branding, Digital Marketing & Influencer Agency",
    template: "%s | HRIX",
  },
  description:
    "HRIX helps businesses grow through branding, influencer collaborations, digital marketing, paid advertising, lead generation, and business automation.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HRIX | Branding, Digital Marketing & Influencer Agency",
    description:
      "HRIX helps businesses grow through branding, influencer collaborations, digital marketing, paid advertising, lead generation, and business automation.",
    url: "https://hrixofficial.in",
    siteName: "HRIX",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/hrix-logo.png",
        width: 1200,
        height: 630,
        alt: "HRIX - Branding, Digital Marketing & Influencer Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HRIX | Branding, Digital Marketing & Influencer Agency",
    description:
      "HRIX helps businesses grow through branding, influencer collaborations, digital marketing, paid advertising, lead generation, and business automation.",
    images: ["/hrix-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <AmbientBackground />
        <HrixCursor />
        <a
          href="#main"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
