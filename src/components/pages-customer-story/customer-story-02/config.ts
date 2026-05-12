import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customerStory02Key = "customer-story-02" as const;
export const customerStory02Namespace = "blocks.customer-story-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.customer-story-02.title",
  descriptionKey: "blocks.customer-story-02.description",
  keywords: ["customer story", "case study", "editorial", "config-first"],
  openGraph: { type: "article" },
};

export const customerStory02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-02-article" },
  seo,
} as const;
