import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const contactPage02Key = "contact-page-02" as const;
export const contactPage02Namespace = "blocks.contact-page-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.contact-page-02.title",
  descriptionKey: "blocks.contact-page-02.description",
  keywords: ["next.js template", "contact page", "config-first"],
  openGraph: { type: "website" },
};

export const contactPage02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "contact-page-02-hero" },
  seo,
} as const;
