import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const contactPage03Key = "contact-page-03" as const;
export const contactPage03Namespace = "blocks.contact-page-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.contact-page-03.title",
  descriptionKey: "blocks.contact-page-03.description",
  keywords: ["next.js template", "contact page", "support", "config-first"],
  openGraph: { type: "website" },
};

export const contactPage03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-03-hero" },
  seo,
} as const;
