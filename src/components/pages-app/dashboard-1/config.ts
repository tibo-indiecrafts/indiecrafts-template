import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const dashboard1Key = "dashboard-1" as const;
export const dashboard1Namespace = "blocks.dashboard-1" as const;

const seo: PageSeo = {
  titleKey: "blocks.dashboard-1.title",
  descriptionKey: "blocks.dashboard-1.description",
  // Admin pages should not appear in search.
  noindex: true,
};

export const dashboard1Defaults = {
  layout: "dashboard" as LayoutName,
  seo,
} as const;
