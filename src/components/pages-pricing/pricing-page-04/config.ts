import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const pricingPage04Key = "pricing-page-04" as const;
export const pricingPage04Namespace = "blocks.pricing-page-04" as const;

const seo: PageSeo = {
  titleKey: "blocks.pricing-page-04.title",
  descriptionKey: "blocks.pricing-page-04.description",
  keywords: ["next.js template", "pricing page", "saas pricing", "config-first"],
  openGraph: { type: "website" },
};

export const pricingPage04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "pricing-page-04-hero" },
  seo,
} as const;
