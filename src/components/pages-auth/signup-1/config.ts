import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const signup1Key = "signup-1" as const;
export const signup1Namespace = "blocks.signup-1" as const;

const seo: PageSeo = {
  titleKey: "blocks.signup-1.title",
  descriptionKey: "blocks.signup-1.description",
  noindex: true,
};

export const signup1Defaults = {
  layout: "full-bleed" as LayoutName,
  seo,
} as const;
