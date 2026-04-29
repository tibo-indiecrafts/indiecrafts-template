import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const forgotPassword1Key = "forgot-password-1" as const;
export const forgotPassword1Namespace = "blocks.forgot-password-1" as const;

const seo: PageSeo = {
  titleKey: "blocks.forgot-password-1.title",
  descriptionKey: "blocks.forgot-password-1.description",
  noindex: true,
};

export const forgotPassword1Defaults = {
  layout: "full-bleed" as LayoutName,
  seo,
} as const;
