import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customers02Key = "customers-02" as const;
export const customers02Namespace = "blocks.customers-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-02.title",
  descriptionKey: "blocks.customers-02.description",
  keywords: ["next.js template", "customers page", "case studies", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-1-customers-one` composition. Hero ("Powering
 * success for visionary companies") → MainCustomers two-card grid
 * (Bolt + Prime Video featured stories) → Customers grid (4 logo +
 * story cards: Stripe, Hulu, Vercel, Beacon). Light + dark theme.
 */
export const customers02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-02-hero" },
  seo,
} as const;
