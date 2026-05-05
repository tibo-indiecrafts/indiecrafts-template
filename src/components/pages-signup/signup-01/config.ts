import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const signup01Key = "signup-01" as const;
export const signup01Namespace = "blocks.signup-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.signup-01.title",
  descriptionKey: "blocks.signup-01.description",
  noindex: true,
};

export const signup01Defaults = {
  layout: "full-bleed" as LayoutName,
  seo,
} as const;
