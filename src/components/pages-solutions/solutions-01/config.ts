import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const solutions01Key = "solutions-01" as const;
export const solutions01Namespace = "blocks.solutions-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.solutions-01.title",
  descriptionKey: "blocks.solutions-01.description",
  keywords: ["next.js template", "solutions page", "enterprise", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-solution-one` composition. Inline hero
 * (eyebrow + heading + body + CTA + bullet list, paired with
 * `EnterpriseForm` on the right) → 4-stat trust-bar → collaboration
 * → security → more features → testimonials → cta. Sub-sections
 * + `EnterpriseForm` live as page-local components under
 * `./sections/`.
 */
export const solutions01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "solutions-01-hero" },
  seo,
} as const;
