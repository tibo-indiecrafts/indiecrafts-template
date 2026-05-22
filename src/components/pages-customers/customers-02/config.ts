import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const customers02Key = "customers-02" as const;
export const customers02Namespace = "blocks.customers-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.customers-02.title",
  descriptionKey: "blocks.customers-02.description",
  keywords: ["next.js template", "customers page", "case studies", "config-first"],
  openGraph: { type: "website" },
};

export const customers02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "customers-02-hero" },
  seo,
} as const;
