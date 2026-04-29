import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const error1Key = "error-1" as const;
export const error1Namespace = "blocks.error-1" as const;

const seo: PageSeo = {
  titleKey: "blocks.error-1.title",
  descriptionKey: "blocks.error-1.description",
  noindex: true,
};

export const error1Defaults = {
  layout: "default" as LayoutName,
  seo,
} as const;
