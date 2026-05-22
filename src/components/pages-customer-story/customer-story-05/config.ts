import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const customerStory05Key = "customer-story-05" as const;
export const customerStory05Namespace = "blocks.customer-story-05" as const;

const seo: PageSeo = {
  titleKey: "blocks.customer-story-05.title",
  descriptionKey: "blocks.customer-story-05.description",
  keywords: ["customer story", "case study", "editorial", "config-first"],
  openGraph: { type: "article" },
};

export const customerStory05Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-05-article" },
  seo,
} as const;
