import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const about02Key = "about-02" as const;
export const about02Namespace = "blocks.about-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.about-02.title",
  descriptionKey: "blocks.about-02.description",
  keywords: ["next.js template", "about page", "team", "config-first"],
  openGraph: { type: "website" },
};

export const about02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "about-02-hero" },
  seo,
} as const;
