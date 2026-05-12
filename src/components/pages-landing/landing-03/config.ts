import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const landing03Key = "landing-03" as const;
export const landing03Namespace = "blocks.landing-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.landing-03.title",
  descriptionKey: "blocks.landing-03.description",
  keywords: [
    "next.js template",
    "grid landing",
    "saas landing",
    "analytics",
    "config-first",
  ],
  openGraph: { type: "website" },
};

export const landing03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: {
    hero: "landing-03-hero",
    logoCloud: "landing-03-logo-cloud",
    manifesto: "landing-03-manifesto",
    platform: "landing-03-platform",
    analytics: "landing-03-analytics",
    integrations: "landing-03-integrations",
    testimonials: "landing-03-testimonials",
    cta: "landing-03-cta",
  },
  seo,
} as const;
