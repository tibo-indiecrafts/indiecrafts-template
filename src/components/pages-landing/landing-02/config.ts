import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const landing02Key = "landing-02" as const;
export const landing02Namespace = "blocks.landing-02" as const;

const seo: PageSeo = {
  titleKey: "blocks.landing-02.title",
  descriptionKey: "blocks.landing-02.description",
  keywords: ["next.js template", "dark landing", "saas landing", "config-first"],
  openGraph: { type: "website" },
};

export const landing02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: {
    hero: "landing-02-hero",
    logoCloud: "landing-02-logo-cloud",
    howItWorks: "landing-02-how-it-works",
    platform: "landing-02-platform",
    more: "landing-02-more",
    stats: "landing-02-stats",
    testimonials: "landing-02-testimonials",
    cta: "landing-02-cta",
  },
  seo,
} as const;
