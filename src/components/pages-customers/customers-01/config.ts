import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const customers01Key = "customers-01" as const;
export const customers01Namespace = "blocks.customers-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-01.title",
  descriptionKey: "blocks.customers-01.description",
  keywords: ["next.js template", "customers page", "case studies", "config-first"],
  openGraph: { type: "website" },
};

export const customers01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-01-hero" },
  seo,
} as const;
