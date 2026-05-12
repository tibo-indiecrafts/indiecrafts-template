import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const dashboard01Key = "dashboard-01" as const;
export const dashboard01Namespace = "blocks.dashboard-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.dashboard-01.title",
  descriptionKey: "blocks.dashboard-01.description",

  noindex: true,
};

export const dashboard01Defaults = {
  layout: "dashboard" as LayoutName,
  seo,
} as const;
