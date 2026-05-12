import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const contactPage06Key = "contact-page-06" as const;
export const contactPage06Namespace = "blocks.contact-page-06" as const;

const seo: PageSeo = {
  titleKey: "blocks.contact-page-06.title",
  descriptionKey: "blocks.contact-page-06.description",
  keywords: ["next.js template", "contact sales", "enterprise form", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-contact-sales-one` composition. Centered hero
 * heading "Contact Sales" with a single full-width inquiry form
 * spanning the inner grid. Light + dark theme.
 */
export const contactPage06Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-06-hero" },
  seo,
} as const;
