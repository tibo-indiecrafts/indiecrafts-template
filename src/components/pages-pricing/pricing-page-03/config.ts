import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const pricingPage03Key = "pricing-page-03" as const;
export const pricingPage03Namespace = "blocks.pricing-page-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.pricing-page-03.title",
  descriptionKey: "blocks.pricing-page-03.description",
  keywords: ["next.js template", "pricing page", "saas pricing", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-pricing-one` composition. Inline grid hero
 * with masked Unsplash backdrop → Pricing tiers → LogoCloud →
 * Comparator → FAQs. Light + dark theme compatible.
 */
export const pricingPage03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "pricing-page-03-hero" },
  seo,
} as const;
