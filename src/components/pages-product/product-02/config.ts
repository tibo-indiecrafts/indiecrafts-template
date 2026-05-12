import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const product02Key = "product-02" as const;
export const product02Namespace = "blocks.product-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.product-02.title",
  descriptionKey: "blocks.product-02.description",
  keywords: ["next.js template", "product page", "invoicing", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-product-two` composition. Inline hero
 * (eyebrow + heading + CTA + ProductIllustration) followed by
 * 2 AI feature cards → how-it-works → testimonial → expandable
 * features → notes features → testimonials grid → cta. Sub-sections
 * live as page-local components under `./sections/`.
 */
export const product02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "product-02-hero" },
  seo,
} as const;
