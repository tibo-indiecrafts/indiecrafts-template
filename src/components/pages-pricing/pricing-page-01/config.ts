import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const pricingPage01Key = "pricing-page-01" as const;
export const pricingPage01Namespace = "blocks.pricing-page-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.pricing-page-01.title",
  descriptionKey: "blocks.pricing-page-01.description",
  keywords: ["next.js template", "pricing page", "saas pricing", "config-first"],
  openGraph: { type: "website" },
};

export const pricingPage01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "pricing-page-01-hero" },
  seo,
} as const;
