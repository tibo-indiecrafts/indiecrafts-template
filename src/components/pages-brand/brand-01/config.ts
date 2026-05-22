import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const brand01Key = "brand-01" as const;
export const brand01Namespace = "blocks.brand-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.brand-01.title",
  descriptionKey: "blocks.brand-01.description",
  keywords: ["next.js template", "brand kit", "design system", "config-first"],
  openGraph: { type: "website" },
};

export const brand01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "brand-01-hero" },
  seo,
} as const;
