import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const forgotPassword01Key = "forgot-password-01" as const;
export const forgotPassword01Namespace = "blocks.forgot-password-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.forgot-password-01.title",
  descriptionKey: "blocks.forgot-password-01.description",
  noindex: true,
};

export const forgotPassword01Defaults = {
  layout: "full-bleed" as LayoutName,
  seo,
} as const;
