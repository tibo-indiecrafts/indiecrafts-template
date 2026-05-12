import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const pricingPage05Key = "pricing-page-05" as const;
export const pricingPage05Namespace = "blocks.pricing-page-05" as const;

const seo: PageSeo = {
  titleKey: "blocks.pricing-page-05.title",
  descriptionKey: "blocks.pricing-page-05.description",
  keywords: ["next.js template", "pricing page", "single tier pricing", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-pricing-two` composition. Single-tier pricing
 * page: Container hero → Pricing → LogoCloud → FAQs. Light + dark
 * theme; white page background.
 */
export const pricingPage05Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "pricing-page-05-hero" },
  seo,
} as const;
