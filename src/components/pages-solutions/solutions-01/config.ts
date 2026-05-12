import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const solutions01Key = "solutions-01" as const;
export const solutions01Namespace = "blocks.solutions-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.solutions-01.title",
  descriptionKey: "blocks.solutions-01.description",
  keywords: ["next.js template", "solutions page", "enterprise", "config-first"],
  openGraph: { type: "website" },
};

export const solutions01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { hero: "solutions-01-hero" },
  seo,
} as const;
