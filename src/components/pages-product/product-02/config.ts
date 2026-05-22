import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const product02Key = "product-02" as const;
export const product02Namespace = "blocks.product-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.product-02.title",
  descriptionKey: "blocks.product-02.description",
  keywords: ["next.js template", "product page", "invoicing", "config-first"],
  openGraph: { type: "website" },
};

export const product02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "product-02-hero" },
  seo,
} as const;
