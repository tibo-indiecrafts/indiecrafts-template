import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customers04Key = "customers-04" as const;
export const customers04Namespace = "blocks.customers-04" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-04.title",
  descriptionKey: "blocks.customers-04.description",
  keywords: ["next.js template", "customers page", "case studies", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `libre-customers-one` composition. Hero on
 * `bg-muted/50` → MainCustomers asymmetric grid (2 featured logo +
 * story cards, 8 logo-only cards, indigo glow shadows) → Customers
 * (6 logo+story Cards) → WallOfLoveSection (3-col testimonials) →
 * CallToAction with `cta-illustration`. Light + dark theme.
 */
export const customers04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-04-hero" },
  seo,
} as const;
