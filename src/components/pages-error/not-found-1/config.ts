import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const notFound1Key = "not-found-1" as const;
export const notFound1Namespace = "blocks.not-found-1" as const;

const seo: PageSeo = {
  titleKey: "blocks.not-found-1.title",
  descriptionKey: "blocks.not-found-1.description",
  noindex: true,
};

export const notFound1Defaults = {
  layout: "default" as LayoutName,
  seo,
} as const;
