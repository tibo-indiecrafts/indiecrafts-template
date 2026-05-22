import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const notFound01Key = "not-found-01" as const;
export const notFound01Namespace = "blocks.not-found-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.not-found-01.title",
  descriptionKey: "blocks.not-found-01.description",
  noindex: true,
};

export const notFound01Defaults = {
  layout: "default" as LayoutName,
  seo,
} as const;
