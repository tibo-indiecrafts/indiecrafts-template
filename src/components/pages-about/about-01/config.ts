import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const about01Key = "about-01" as const;
export const about01Namespace = "blocks.about-01" as const;

const seo: PageSeo = {
  titleKey: "blocks.about-01.title",
  descriptionKey: "blocks.about-01.description",
  openGraph: { type: "website" },
};

export const about01Defaults = {
  layout: "default" as LayoutName,
  sectionIds: {
    content: "about-01-content",
    team: "about-01-team",
    faq: "about-01-faq",
    cta: "about-01-cta",
  },
  seo,
} as const;
