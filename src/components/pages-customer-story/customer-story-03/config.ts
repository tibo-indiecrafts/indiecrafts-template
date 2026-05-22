import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const customerStory03Key = "customer-story-03" as const;
export const customerStory03Namespace = "blocks.customer-story-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.customer-story-03.title",
  descriptionKey: "blocks.customer-story-03.description",
  keywords: ["customer story", "case study", "editorial", "config-first"],
  openGraph: { type: "article" },
};

export const customerStory03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-03-article" },
  seo,
} as const;
