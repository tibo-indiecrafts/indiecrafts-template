import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const brand01Key = "brand-01" as const;
export const brand01Namespace = "blocks.brand-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.brand-01.title",
  descriptionKey: "blocks.brand-01.description",
  keywords: ["next.js template", "brand kit", "design system", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-brand-one` composition. Brand kit page:
 * hero (Brand Kit headline + download CTA) → Naming guidelines →
 * Color palette (4 swatches) → Logo + Logomark download cards.
 * Light + dark theme.
 */
export const brand01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "brand-01-hero" },
  seo,
} as const;
