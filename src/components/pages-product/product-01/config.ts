import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const product01Key = "product-01" as const;
export const product01Namespace = "blocks.product-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.product-01.title",
  descriptionKey: "blocks.product-01.description",
  keywords: ["next.js template", "product page", "ai search", "config-first"],
  openGraph: { type: "website" },
};

export const product01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "product-01-hero" },
  seo,
} as const;
