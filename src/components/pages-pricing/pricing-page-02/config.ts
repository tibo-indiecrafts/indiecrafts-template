import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const pricingPage02Key = "pricing-page-02" as const;
export const pricingPage02Namespace = "blocks.pricing-page-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.pricing-page-02.title",
  descriptionKey: "blocks.pricing-page-02.description",
  keywords: ["next.js template", "pricing page", "saas pricing", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-1-pricing-one` composition. Inline hero
 * (centered title + body on bg-muted) → Pricing tiers →
 * Testimonial → Comparator → FAQs. Light + dark theme compatible.
 */
export const pricingPage02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "pricing-page-02-hero" },
  seo,
} as const;
