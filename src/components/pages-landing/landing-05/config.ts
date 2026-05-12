import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const landing05Key = "landing-05" as const;
export const landing05Namespace = "blocks.landing-05" as const;

const seo: PageSeo = {
  titleKey: "blocks.landing-05.title",
  descriptionKey: "blocks.landing-05.description",
  keywords: ["next.js template", "saas landing", "fintech landing", "config-first"],
  openGraph: { type: "website" },
};

export const landing05Defaults = {
  layout: "default" as LayoutName,
  sectionIds: {
    hero: "landing-05-hero",
    logoCloud: "landing-05-logo-cloud",
    analytics: "landing-05-analytics",
    platform: "landing-05-platform",
    productDirection: "landing-05-product-direction",
    moreFeatures: "landing-05-more-features",
    testimonials: "landing-05-testimonials",
    cta: "landing-05-cta",
  },
  seo,
} as const;
