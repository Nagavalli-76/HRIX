const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrixofficial.in";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HRIX",
    url: BASE_URL,
    logo: `${BASE_URL}/hrix-logo.png`,
    email: "hrixofficial@gmail.com",
    description:
      "HRIX is a comprehensive branding, digital marketing, influencer collaboration, and business automation agency.",
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HRIX",
    url: BASE_URL,
    description:
      "HRIX helps businesses grow through branding, influencer collaborations, digital marketing, paid advertising, lead generation, and business automation.",
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${BASE_URL}${item.path}`,
    })),
  };
}

export interface ServiceSchemaProps {
  name: string;
  serviceType: string;
  description: string;
  path: string;
}

export function getServiceSchema({ name, serviceType, description, path }: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: `${BASE_URL}${path}`,
    provider: {
      "@type": "Organization",
      name: "HRIX",
      url: BASE_URL,
    },
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
