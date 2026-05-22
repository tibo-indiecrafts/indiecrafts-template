import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const pricingPage03Key = "pricing-page-03" as const;
export const pricingPage03Namespace = "blocks.pricing-page-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.pricing-page-03.title",
  descriptionKey: "blocks.pricing-page-03.description",
  keywords: ["next.js template", "pricing page", "saas pricing", "config-first"],
  openGraph: { type: "website" },
};

export const pricingPage03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "pricing-page-03-hero" },
  seo,
} as const;
