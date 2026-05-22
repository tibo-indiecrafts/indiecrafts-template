import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config";

export const landing06Key = "landing-06" as const;
export const landing06Namespace = "blocks.landing-06" as const;

const seo: PageSeo = {
  titleKey: "blocks.landing-06.title",
  descriptionKey: "blocks.landing-06.description",
  keywords: ["next.js template", "saas landing", "ai pricing", "config-first"],
  openGraph: { type: "website" },
};

export const landing06Defaults = {
  layout: "default" as LayoutName,
  sectionIds: {
    hero: "landing-06-hero",
    logoCloud: "landing-06-logo-cloud",
    analytics: "landing-06-analytics",
    platform: "landing-06-platform",
    testimonial: "landing-06-testimonial",
    howItWorks: "landing-06-how-it-works",
    testimonials: "landing-06-testimonials",
    cta: "landing-06-cta",
  },
  seo,
} as const;
