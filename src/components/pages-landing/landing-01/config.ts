import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const landing01Key = "landing-01" as const;

export const landing01Namespace = "blocks.landing-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.landing-01.title",
  descriptionKey: "blocks.landing-01.description",
  keywords: ["next.js template", "config-first", "modular website", "i18n"],
  openGraph: { type: "website" },
};

export const landing01Defaults = {
  layout: "default" as LayoutName,

  sectionIds: {
    features: "landing-01-features",
    cta: "landing-01-cta",
    pricing: "landing-01-pricing",
    testimonials: "landing-01-testimonials",
  },
  seo,
} as const;
