import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customers04Key = "customers-04" as const;
export const customers04Namespace = "blocks.customers-04" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-04.title",
  descriptionKey: "blocks.customers-04.description",
  keywords: ["next.js template", "customers page", "case studies", "config-first"],
  openGraph: { type: "website" },
};

export const customers04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-04-hero" },
  seo,
} as const;
