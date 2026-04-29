import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const about1Key = "about-1" as const;
export const about1Namespace = "blocks.about-1" as const;

const seo: PageSeo = {
  titleKey: "blocks.about-1.title",
  descriptionKey: "blocks.about-1.description",
  openGraph: { type: "website" },
};

export const about1Defaults = {
  layout: "default" as LayoutName,
  sectionIds: {
    content: "about-1-content",
    team: "about-1-team",
    faq: "about-1-faq",
    cta: "about-1-cta",
  },
  seo,
} as const;
