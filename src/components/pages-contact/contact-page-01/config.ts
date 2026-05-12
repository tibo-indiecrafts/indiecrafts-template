import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const contactPage01Key = "contact-page-01" as const;
export const contactPage01Namespace = "blocks.contact-page-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.contact-page-01.title",
  descriptionKey: "blocks.contact-page-01.description",
  keywords: ["next.js template", "contact page", "sales", "config-first"],
  openGraph: { type: "website" },
};

/**
 * Tailark Pro `grid-2-contact-five` composition. Sales contact
 * page: eyebrow ("Sales") → 2-column grid of pitch + benefits +
 * contact details on the left, form (`EnterpriseForm`) on the
 * right. Light + dark theme.
 */
export const contactPage01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-01-hero" },
  seo,
} as const;
