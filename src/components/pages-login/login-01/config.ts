import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const login01Key = "pages-login-01" as const;
export const login01Namespace = "blocks.pages-login-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.pages-login-01.title",
  descriptionKey: "blocks.pages-login-01.description",

  noindex: true,
};

export const login01Defaults = {
  layout: "full-bleed" as LayoutName,
  seo,
} as const;
