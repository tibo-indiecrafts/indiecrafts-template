import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const customers03Key = "customers-03" as const;
export const customers03Namespace = "blocks.customers-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-03.title",
  descriptionKey: "blocks.customers-03.description",
  keywords: ["next.js template", "customers page", "logo wall", "config-first"],
  openGraph: { type: "website" },
};

export const customers03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-03-hero" },
  seo,
} as const;
