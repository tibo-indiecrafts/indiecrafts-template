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

export const contactPage01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-01-hero" },
  seo,
} as const;
