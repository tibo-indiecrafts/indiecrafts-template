import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const landing04Key = "landing-04" as const;
export const landing04Namespace = "blocks.landing-04" as const;

const seo: PageSeo = {
  titleKey: "blocks.landing-04.title",
  descriptionKey: "blocks.landing-04.description",
  keywords: [
    "next.js template",
    "grid landing",
    "saas landing",
    "enterprise",
    "config-first",
  ],
  openGraph: { type: "website" },
};

export const landing04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: {
    hero: "landing-04-hero",
    logoCloud: "landing-04-logo-cloud",
    manifesto: "landing-04-manifesto",
    platform: "landing-04-platform",
    analytics: "landing-04-analytics",
    integrations: "landing-04-integrations",
    enterprise: "landing-04-enterprise",
    testimonials: "landing-04-testimonials",
    cta: "landing-04-cta",
  },
  seo,
} as const;
