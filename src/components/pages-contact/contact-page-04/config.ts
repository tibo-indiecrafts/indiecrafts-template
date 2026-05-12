import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const contactPage04Key = "contact-page-04" as const;
export const contactPage04Namespace = "blocks.contact-page-04" as const;

const seo: PageSeo = {
  titleKey: "blocks.contact-page-04.title",
  descriptionKey: "blocks.contact-page-04.description",
  keywords: ["next.js template", "contact page", "inquiry form", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-contact-three` composition. Hero heading + an
 * inquiry form area wrapped in an indigo glow, alongside a 2-cell
 * Collaborate / Press contact-channel column. Light + dark theme.
 */
export const contactPage04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-04-hero" },
  seo,
} as const;
