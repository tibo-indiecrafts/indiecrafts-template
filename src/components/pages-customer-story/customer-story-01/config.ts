import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customerStory01Key = "customer-story-01" as const;
export const customerStory01Namespace = "blocks.customer-story-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.customer-story-01.title",
  descriptionKey: "blocks.customer-story-01.description",
  keywords: ["customer story", "case study", "editorial", "config-first"],
  openGraph: { type: "article" },
};

export const customerStory01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-01-article" },
  seo,
} as const;
