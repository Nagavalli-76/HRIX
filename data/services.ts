export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface ServiceWorkflowStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  summary: string;
  targetAudience: string[];
  deliverables: ServiceDeliverable[];
  workflow: ServiceWorkflowStep[];
  faqs: ServiceFAQ[];
  relatedSlugs: string[];
}

export const servicesData: Record<string, ServiceDetail> = {
  "branding-and-identity": {
    slug: "branding-and-identity",
    name: "Branding & Brand Identity",
    title: "Branding & Brand Identity Services | HRIX",
    metaDescription:
      "Craft distinct brand positioning, cohesive visual identities, brand systems, and guidelines that set your business apart in digital and creator-led channels.",
    h1: "Branding & Brand Identity Systems",
    eyebrow: "Brand Architecture & Visual Design",
    summary:
      "HRIX builds memorable, authentic brand identities that communicate clearly and command authority across modern digital touchpoints, campaigns, and creator collaborations.",
    targetAudience: [
      "Emerging direct-to-consumer (D2C) brands preparing for multi-channel scaling.",
      "High-growth startups seeking a consistent, professional market presence.",
      "Established businesses pivoting to modern creator-driven digital ecosystems.",
      "Founders needing unified brand guidelines, typography, and visual assets.",
    ],
    deliverables: [
      {
        title: "Brand Strategy & Positioning",
        description:
          "Target audience analysis, competitive differentiation, value proposition articulation, and brand voice definition.",
      },
      {
        title: "Visual Identity & Logo Suite",
        description:
          "Comprehensive primary logos, secondary marks, favicons, dark/light variations, and vector master assets.",
      },
      {
        title: "Typography & Color Systems",
        description:
          "Hierarchical type scales, web-safe digital font stacks, primary and functional color palettes, and contrast-compliant tokens.",
      },
      {
        title: "Brand Guidelines & Design Tokens",
        description:
          "Documented rules for layout, spacing, social creative templates, and digital media kits to ensure long-term brand integrity.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Discovery & Narrative Definition",
        description:
          "We analyze your business objectives, industry landscape, audience expectations, and core mission to determine your distinctive brand angle.",
      },
      {
        step: "02",
        title: "Concept Development & Visual Direction",
        description:
          "We explore typography combinations, color palettes, and mark directions, iterating until we lock in a robust visual thesis.",
      },
      {
        step: "03",
        title: "Brand System Standardization",
        description:
          "We build complete vector kits, responsive design tokens, and practical usage documentation for internal teams and external agency partners.",
      },
      {
        step: "04",
        title: "Deployment & Asset Handover",
        description:
          "We deliver organized source files, export-ready assets, and guidance on rolling out the identity across web and social platforms.",
      },
    ],
    faqs: [
      {
        question: "What files and assets are included in a brand identity project?",
        answer:
          "You receive complete vector source files (SVG, EPS, AI), high-resolution web formats (PNG, WebP), color specifications (HEX, RGB, CMYK), and a comprehensive Brand Style Guide document.",
      },
      {
        question: "How long does a brand identity development cycle take?",
        answer:
          "Typically between 2 to 4 weeks depending on the scope of deliverables, revision rounds, and whether collateral templates are included.",
      },
      {
        question: "Do you design for creator and influencer partnerships?",
        answer:
          "Yes. We design brand guidelines specifically engineered for consistent representation across sponsored creator content, reels, and digital campaign briefs.",
      },
    ],
    relatedSlugs: [
      "website-design-development",
      "influencer-marketing",
      "social-media-marketing",
    ],
  },
  "influencer-marketing": {
    slug: "influencer-marketing",
    name: "Influencer Marketing & Creator Collaborations",
    title: "Influencer Marketing & Creator Collaborations | HRIX",
    metaDescription:
      "Connect with vetted creators, manage end-to-end influencer campaigns, streamline rate cards, and achieve measurable reach and brand trust.",
    h1: "Influencer Marketing & Creator Collaborations",
    eyebrow: "Creator Discovery & Campaign Execution",
    summary:
      "HRIX connects brands with authentic creators who match their industry, audience demographics, and campaign goals. We streamline discovery, contracts, briefs, and execution.",
    targetAudience: [
      "Brands wanting to launch high-engagement influencer campaigns without manual outreach.",
      "Companies seeking credible third-party advocacy to drive product trials and awareness.",
      "Marketers tired of opaque follower counts who need verified engagement and clean workflows.",
      "Creators looking for structured, transparent brand partnership opportunities.",
    ],
    deliverables: [
      {
        title: "Audience-Matched Creator Discovery",
        description:
          "Targeted filtering by category, platform, engagement consistency, and audience relevance across India.",
      },
      {
        title: "Campaign Briefs & Creative Direction",
        description:
          "Clear creative guidelines and deliverable checklists ensuring creators stay on-message while maintaining their natural voice.",
      },
      {
        title: "Collaboration & Delivery Oversight",
        description:
          "End-to-end tracking of sample dispatches, draft reviews, revision cycles, and publication schedules.",
      },
      {
        title: "Performance & Reach Reporting",
        description:
          "Analysis of views, engagement rates, click-through trends, and post-campaign learnings to inform future budget allocation.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Briefing & Objective Setting",
        description:
          "We define key performance indicators, key messaging points, target demographics, and preferred content formats.",
      },
      {
        step: "02",
        title: "Creator Selection & Roster Curation",
        description:
          "We identify and shortlist verified creators whose followers align directly with your customer profile.",
      },
      {
        step: "03",
        title: "Contracting & Content Review",
        description:
          "We handle rate alignments, content outlines, and draft sign-offs to protect brand standards before live release.",
      },
      {
        step: "04",
        title: "Execution & Analysis",
        description:
          "Posts go live according to scheduled flight dates, followed by reporting on content performance and audience feedback.",
      },
    ],
    faqs: [
      {
        question: "How does HRIX choose creators for campaigns?",
        answer:
          "We evaluate creator niche alignment, historical engagement quality, audience authenticity, and past content consistency rather than raw vanity metrics.",
      },
      {
        question: "Can both micro and macro creators be engaged?",
        answer:
          "Yes. Campaigns can be configured for targeted niche communities through micro-creators or broader visibility through macro-creators.",
      },
      {
        question: "Who retains ownership of the creator content produced?",
        answer:
          "Usage rights and licensing terms are clearly specified in campaign contracts based on whether the brand intends to use content organically or as paid ad creative.",
      },
    ],
    relatedSlugs: [
      "lead-generation",
      "social-media-marketing",
      "digital-marketing-advertising",
    ],
  },
  "digital-marketing-advertising": {
    slug: "digital-marketing-advertising",
    name: "Digital Marketing & Paid Advertising",
    title: "Digital Marketing & Paid Advertising Services | HRIX",
    metaDescription:
      "Drive profitable customer acquisition with performance marketing, search advertising, paid social campaigns, and data-driven ad management.",
    h1: "Digital Marketing & Paid Advertising",
    eyebrow: "Performance Media & Paid Acquisition",
    summary:
      "Scale predictable traffic and revenue with structured paid advertising on Google Search, Meta, and relevant performance networks, managed with strict ROAS focus.",
    targetAudience: [
      "D2C brands seeking scalable customer acquisition channels with predictable CAC.",
      "B2B service companies needing targeted lead generation through Search and LinkedIn.",
      "Businesses launching new products who need immediate, measurable market demand.",
      "Enterprises looking to audit and optimize underperforming paid advertising funnels.",
    ],
    deliverables: [
      {
        title: "Search Engine Advertising (PPC)",
        description:
          "Intent-targeted Google Ads campaigns targeting high-intent commercial keywords with precise bidding strategies.",
      },
      {
        title: "Paid Social Campaigns",
        description:
          "Multi-stage Meta (Instagram/Facebook) and YouTube video ad campaigns optimized for prospecting and retargeting.",
      },
      {
        title: "Creative Testing & Copywriting",
        description:
          "High-converting ad angles, hook variations, copy variants, and responsive visual creative iterations.",
      },
      {
        title: "Analytics, Attribution & ROAS Tracking",
        description:
          "Conversion API integration, pixel setup, UTM governance, and clear attribution reporting.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Account & Funnel Audit",
        description:
          "We examine past ad spend, audience structures, keyword quality scores, and landing page conversion bottlenecks.",
      },
      {
        step: "02",
        title: "Campaign Architecture Setup",
        description:
          "We build clean campaign structures separating cold prospecting, warm consideration, and high-intent remarketing audiences.",
      },
      {
        step: "03",
        title: "Creative Launch & Rapid Testing",
        description:
          "We test multiple creative angles, headlines, and call-to-actions to uncover top-performing media assets.",
      },
      {
        step: "04",
        title: "Continuous Optimization & Scaling",
        description:
          "Budget is systematically shifted to winning audiences and placements while minimizing ad fatigue through continuous testing.",
      },
    ],
    faqs: [
      {
        question: "Which platforms do you manage paid ads on?",
        answer:
          "We manage campaigns primarily on Google Ads (Search, Performance Max, YouTube) and Meta Ads (Instagram, Facebook), tailored to where your customers congregate.",
      },
      {
        question: "How do you measure advertising success?",
        answer:
          "Success is measured by revenue-focused metrics: Cost per Acquisition (CPA), Return on Ad Spend (ROAS), Qualified Lead Cost, and overall pipeline velocity.",
      },
      {
        question: "Do you provide landing page recommendations for ads?",
        answer:
          "Yes. Traffic conversion depends heavily on landing page quality, speed, and message match, so landing page optimization is integrated into all campaigns.",
      },
    ],
    relatedSlugs: [
      "lead-generation",
      "website-design-development",
      "influencer-marketing",
    ],
  },
  "social-media-marketing": {
    slug: "social-media-marketing",
    name: "Social Media Marketing & Brand Visibility",
    title: "Social Media Marketing & Brand Visibility | HRIX",
    metaDescription:
      "Build brand authority, community loyalty, and consistent digital visibility across Instagram, LinkedIn, and video-first social channels.",
    h1: "Social Media Marketing & Brand Visibility",
    eyebrow: "Organic Growth & Content Strategy",
    summary:
      "Grow an engaged, relevant audience through intentional content calendars, video storytelling, aesthetic consistency, and active community engagement.",
    targetAudience: [
      "Brands wanting to turn stagnant social channels into active community touchpoints.",
      "B2B firms aiming to position founders and executives as industry authorities on LinkedIn.",
      "Consumer brands needing high-cadence short-form video reels that build trust.",
      "Organizations seeking a cohesive voice across multiple public platforms.",
    ],
    deliverables: [
      {
        title: "Channel Positioning & Content Strategy",
        description:
          "Platform-specific content pillars, visual identity adaptation, and communication guidelines designed for organic reach.",
      },
      {
        title: "Short-Form Video & Reel Production Direction",
        description:
          "Scriptwriting, hook ideation, visual pacing, and editing standards built for TikTok and Instagram algorithms.",
      },
      {
        title: "Publishing Calendar & Schedule Management",
        description:
          "Consistent publishing pipelines ensuring frequent, timely visibility during peak audience activity windows.",
      },
      {
        title: "Community Moderation & Engagement",
        description:
          "Active interaction with comments, industry discussions, and audience inquiries to humanize your brand presence.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Channel Audit & Audience Mapping",
        description:
          "We evaluate current engagement metrics, competitor content, and audience sentiment to pinpoint growth gaps.",
      },
      {
        step: "02",
        title: "Editorial Calendar Architecture",
        description:
          "We map monthly themes, educational formats, product spotlights, and culturally relevant trend opportunities.",
      },
      {
        step: "03",
        title: "Creative Production & Review",
        description:
          "We draft scripts, design carousels, edit reels, and finalize copy for scheduled client review and sign-off.",
      },
      {
        step: "04",
        title: "Publishing & Insight Iteration",
        description:
          "Posts are distributed and analyzed weekly to double down on formats generating the highest organic saves, shares, and inquiries.",
      },
    ],
    faqs: [
      {
        question: "Which social media platforms are most effective for our industry?",
        answer:
          "Consumer and lifestyle brands typically see the highest engagement on Instagram and YouTube, while B2B, SaaS, and professional services excel on LinkedIn and X.",
      },
      {
        question: "Do you handle both graphic design and video editing?",
        answer:
          "Yes. Our workflows encompass short-form video editing, visual carousels, branded infographics, and compelling copy captions.",
      },
      {
        question: "How do you ensure our brand tone of voice remains consistent?",
        answer:
          "We establish formal brand voice documentation and editorial guidelines that dictate language, phrasing, and response protocols across all posts.",
      },
    ],
    relatedSlugs: [
      "branding-and-identity",
      "influencer-marketing",
      "digital-marketing-advertising",
    ],
  },
  "lead-generation": {
    slug: "lead-generation",
    name: "Lead Generation & Campaign Management",
    title: "Lead Generation & Campaign Management Services | HRIX",
    metaDescription:
      "Generate qualified sales leads through targeted campaigns, high-converting landing funnels, automated qualification, and CRM integration.",
    h1: "Lead Generation & Campaign Management",
    eyebrow: "B2B & High-Value Consumer Pipeline",
    summary:
      "Transform digital interest into verified inquiries and sales appointments with structured lead funnels, intent targeting, and rapid automated follow-ups.",
    targetAudience: [
      "B2B companies requiring a steady pipeline of qualified decision-maker inquiries.",
      "High-ticket service providers and agencies needing structured client acquisition.",
      "Education, real estate, and professional consultancies looking to lower lead acquisition costs.",
      "Businesses losing inbound leads due to slow response times and manual qualification.",
    ],
    deliverables: [
      {
        title: "High-Converting Lead Funnels",
        description:
          "Tailored landing pages, multi-step qualification questionnaires, and friction-free lead capture mechanisms.",
      },
      {
        title: "Intent-Based Campaign Management",
        description:
          "Integrated lead campaigns across Google Search, LinkedIn Lead Gen Forms, and Meta Instant Forms.",
      },
      {
        title: "Automated Lead Routing & Instant Alerts",
        description:
          "Immediate SMS, WhatsApp, and email alerts to your sales team within seconds of lead submission.",
      },
      {
        title: "Lead Quality Scoring & CRM Synchronization",
        description:
          "Automated filtering to separate serious buyers from unqualified inquiries before they reach your sales reps.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Ideal Customer Profile (ICP) Definition",
        description:
          "We document your highest-margin customer personas, pain points, purchasing triggers, and qualifying criteria.",
      },
      {
        step: "02",
        title: "Offer & Funnel Construction",
        description:
          "We craft compelling lead magnets, conversion-focused landing pages, and interactive qualification forms.",
      },
      {
        step: "03",
        title: "Traffic Activation & CRM Hookup",
        description:
          "Campaigns launch across targeted channels with direct webhook connections feeding into your CRM or pipeline dashboard.",
      },
      {
        step: "04",
        title: "Lead Quality Refinement",
        description:
          "We review pipeline feedback with your sales team weekly to tune audience parameters and maximize closed-won rates.",
      },
    ],
    faqs: [
      {
        question: "How do you prevent spam or unqualified leads?",
        answer:
          "We implement multi-step qualification questions, work email validation, captcha verification, and conditional logic so only qualified prospects submit.",
      },
      {
        question: "Can leads sync directly into our existing CRM?",
        answer:
          "Yes. We configure automated integrations with HubSpot, Salesforce, Zoho, Google Sheets, or custom webhooks in real time.",
      },
      {
        question: "What is the expected turnaround time for launch?",
        answer:
          "Lead generation funnels and campaigns are typically developed, integrated, and launched within 7 to 14 business days.",
      },
    ],
    relatedSlugs: [
      "business-systems-automation",
      "digital-marketing-advertising",
      "website-design-development",
    ],
  },
  "business-systems-automation": {
    slug: "business-systems-automation",
    name: "Business Systems & Workflow Automation",
    title: "Business Systems & Workflow Automation Services | HRIX",
    metaDescription:
      "Automate repetitive operational tasks, streamline client onboarding, integrate CRMs and payment gateways, and build scalable custom internal systems.",
    h1: "Business Systems & Workflow Automation",
    eyebrow: "Operational Efficiency & Modern Tooling",
    summary:
      "Eliminate repetitive manual tasks, reduce human error, and connect your business tools into seamless automated workflows that run 24/7 without friction.",
    targetAudience: [
      "Growing companies struggling with disjointed software tools and manual spreadsheets.",
      "Service businesses losing time on repetitive onboarding, invoicing, and reporting.",
      "Founders wanting centralized operational dashboards and automated customer journeys.",
      "Enterprises looking to modernize legacy business processes with custom integrations.",
    ],
    deliverables: [
      {
        title: "Workflow Automation & Webhook Architecture",
        description:
          "Automated pipelines connecting form submissions, email notifications, payment confirmations, and team alerts.",
      },
      {
        title: "Custom CRM & Database Systems",
        description:
          "Tailored relational database architecture (Supabase / PostgreSQL) for client data, orders, and internal records.",
      },
      {
        title: "Payment Gateway & Billing Integration",
        description:
          "Automated subscription management, invoice dispatch, and Razorpay/Stripe checkout workflow setups.",
      },
      {
        title: "Internal Operations Dashboards",
        description:
          "Role-based administrative dashboards for moderation, status tracking, customer support, and business analytics.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Process Discovery & Friction Mapping",
        description:
          "We map every manual step in your customer onboarding, sales follow-up, delivery, and internal communications.",
      },
      {
        step: "02",
        title: "Architecture & Integration Blueprint",
        description:
          "We select the optimal database schema, webhook pathways, and integration architecture to fit your current stack.",
      },
      {
        step: "03",
        title: "Development & Automated Testing",
        description:
          "We construct automated workflows, data validations, fallback error logging, and security checks.",
      },
      {
        step: "04",
        title: "Staff Onboarding & Monitoring",
        description:
          "We provide clear team documentation and configure automated health alerts to ensure continuous, reliable operation.",
      },
    ],
    faqs: [
      {
        question: "What platforms and technologies do you build automations with?",
        answer:
          "We build with modern cloud solutions including Supabase, PostgreSQL, Next.js server actions, Resend, webhook listeners, Make/Zapier, and custom API endpoints.",
      },
      {
        question: "How secure is automated customer data handling?",
        answer:
          "All workflows enforce encrypted HTTPS communication, strict environment variable segregation, and role-based access control (RLS) on databases.",
      },
      {
        question: "Can automations be adjusted as our business rules evolve?",
        answer:
          "Yes. Systems are built modularly so new notification channels, approval steps, or payment states can be introduced without breaking existing flows.",
      },
    ],
    relatedSlugs: [
      "website-design-development",
      "lead-generation",
      "branding-and-identity",
    ],
  },
  "website-design-development": {
    slug: "website-design-development",
    name: "Website Design & Development",
    title: "Website Design & Custom Web Development | HRIX",
    metaDescription:
      "Fast, responsive, SEO-ready Next.js web applications and marketing websites engineered for high conversions, performance, and accessibility.",
    h1: "Website Design & Custom Web Development",
    eyebrow: "Full-Stack Web Engineering & UI/UX",
    summary:
      "HRIX engineers blazing-fast, visually stunning, conversion-focused websites and web applications with Next.js, TypeScript, Tailwind CSS, and robust backend integrations.",
    targetAudience: [
      "Brands needing a modern, premium digital presence that outclasses competitors.",
      "Businesses replacing sluggish WordPress sites with fast, secure modern web apps.",
      "Startups requiring custom portal functionality, authentication, and database connectivity.",
      "Companies demanding high Google PageSpeed scores, technical SEO, and mobile excellence.",
    ],
    deliverables: [
      {
        title: "Responsive UI/UX Design",
        description:
          "Clean, typography-driven layouts, dark/light aesthetics, intuitive micro-interactions, and mobile-first accessibility.",
      },
      {
        title: "Full-Stack Next.js Architecture",
        description:
          "Server-side rendering (SSR), static site generation (SSG), React 19, TypeScript, and Tailwind CSS for peak performance.",
      },
      {
        title: "Technical SEO & Core Web Vitals Optimization",
        description:
          "Semantic HTML5, automated XML sitemaps, structured JSON-LD data, Open Graph tags, and zero layout shifts.",
      },
      {
        title: "Database, Auth & Payment Integration",
        description:
          "Secure authentication, protected user dashboards, database storage, and Razorpay/Stripe checkout integration.",
      },
    ],
    workflow: [
      {
        step: "01",
        title: "Information Architecture & UX Wireframes",
        description:
          "We structure page hierarchies, content flows, and navigation pathways to guide visitors directly toward action.",
      },
      {
        step: "02",
        title: "Design System & High-Fidelity UI",
        description:
          "We design visual mockups adhering to your typography and color rules, ensuring consistent brand polish across screen sizes.",
      },
      {
        step: "03",
        title: "Production-Grade Engineering",
        description:
          "We write clean, modular Next.js components, optimize images, configure SEO metadata, and integrate database backend routes.",
      },
      {
        step: "04",
        title: "Testing, Deployment & Search Indexing",
        description:
          "We run performance audits, cross-browser tests, and search console readiness checks before launching to production HTTPS.",
      },
    ],
    faqs: [
      {
        question: "Why does HRIX build websites with Next.js rather than traditional CMSs?",
        answer:
          "Next.js provides enterprise-grade performance, instantaneous page loads, superior Core Web Vitals, tight security, and the flexibility to add custom web applications without plugin bloat.",
      },
      {
        question: "Is technical SEO built into the website from day one?",
        answer:
          "Yes. Every site is built with semantic HTML headings, XML sitemaps, robots.txt directives, canonical tags, Open Graph cards, and schema.org structured data.",
      },
      {
        question: "Can our website support user logins, payments, and dashboards?",
        answer:
          "Yes. We specialize in full-stack applications with user authentication, role-based dashboards, database persistence, and payment gateway integrations.",
      },
    ],
    relatedSlugs: [
      "business-systems-automation",
      "branding-and-identity",
      "digital-marketing-advertising",
    ],
  },
};

export const serviceList = Object.values(servicesData);
