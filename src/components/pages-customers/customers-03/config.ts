import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customers03Key = "customers-03" as const;
export const customers03Namespace = "blocks.customers-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-03.title",
  descriptionKey: "blocks.customers-03.description",
  keywords: ["next.js template", "customers page", "logo wall", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-customers-one` composition. Hero
 * ("Companies building with Tailark") inside a 10×3 dotted-grid
 * frame → MainCustomers (Bolt + Supabase featured stories) →
 * Customers (12-cell hover-reveal logo wall) → CallToAction. Light
 * + dark theme.
 */
export const customers03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-03-hero" },
  seo,
} as const;
