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

export const contactPage04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-04-hero" },
  seo,
} as const;
