import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const contactPage05Key = "contact-page-05" as const;
export const contactPage05Namespace = "blocks.contact-page-05" as const;

const seo: PageSeo = {
  titleKey: "blocks.contact-page-05.title",
  descriptionKey: "blocks.contact-page-05.description",
  keywords: ["next.js template", "contact page", "inquiry form", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-contact-two` composition. Hero heading, then a
 * 2-cell Collaborate / Press contact-channel row above a full-width
 * inquiry form. Light + dark theme.
 */
export const contactPage05Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-05-hero" },
  seo,
} as const;
