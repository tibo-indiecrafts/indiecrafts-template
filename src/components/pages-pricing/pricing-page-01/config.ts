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

/**
 * Tailark Pro `dark-pricing-one` composition. Inline hero with
 * gradient-stroked accent + body, then Pricing tiers, LogoCloud,
 * Comparator table, and FAQs accordion. Sub-sections live as
 * page-local components under `./sections/`. Despite the
 * "dark-" prefix this page is rendered in BOTH light + dark theme
 * — `data-theme="dark"` overrides on sub-sections were dropped per
 * the project's theme-compatibility rule.
 */
export const pricingPage01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "pricing-page-01-hero" },
  seo,
} as const;
