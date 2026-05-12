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

export const contactPage05Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-05-hero" },
  seo,
} as const;
