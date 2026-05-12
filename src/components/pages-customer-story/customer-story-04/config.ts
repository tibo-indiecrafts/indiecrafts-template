import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customerStory04Key = "customer-story-04" as const;
export const customerStory04Namespace = "blocks.customer-story-04" as const;

const seo: PageSeo = {
  titleKey: "blocks.customer-story-04.title",
  descriptionKey: "blocks.customer-story-04.description",
  keywords: ["customer story", "case study", "editorial", "config-first"],
  openGraph: { type: "article" },
};

export const customerStory04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-04-article" },
  seo,
} as const;
