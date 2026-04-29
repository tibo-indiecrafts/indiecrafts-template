import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const login1Key = "login-1" as const;
export const login1Namespace = "blocks.login-1" as const;

const seo: PageSeo = {
  titleKey: "blocks.login-1.title",
  descriptionKey: "blocks.login-1.description",
  // Auth pages aren't useful in search results.
  noindex: true,
};

export const login1Defaults = {
  layout: "full-bleed" as LayoutName,
  seo,
} as const;
