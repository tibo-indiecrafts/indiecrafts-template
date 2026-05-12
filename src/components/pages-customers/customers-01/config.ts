import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customers01Key = "customers-01" as const;
export const customers01Namespace = "blocks.customers-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-01.title",
  descriptionKey: "blocks.customers-01.description",
  keywords: ["next.js template", "customers page", "case studies", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `dark-customers-one` composition. Hero ("Meet our
 * Customers") → MainCustomers feature card with image-blended
 * background → Customers story grid (6 logo+story cards) →
 * WallOfLoveSection (3-column testimonial wall) → CallToAction.
 * Light + dark theme.
 */
export const customers01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-01-hero" },
  seo,
} as const;
