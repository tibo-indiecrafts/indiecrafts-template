import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const error01Key = "error-01" as const;
export const error01Namespace = "blocks.error-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.error-01.title",
  descriptionKey: "blocks.error-01.description",
  noindex: true,
};

export const error01Defaults = {
  layout: "default" as LayoutName,
  seo,
} as const;
