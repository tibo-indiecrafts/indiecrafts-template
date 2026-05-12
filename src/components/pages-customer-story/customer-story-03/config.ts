import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customerStory03Key = "customer-story-03" as const;
export const customerStory03Namespace = "blocks.customer-story-03" as const;

const seo: PageSeo = {
  titleKey: "blocks.customer-story-03.title",
  descriptionKey: "blocks.customer-story-03.description",
  keywords: ["customer story", "case study", "editorial", "config-first"],
  openGraph: { type: "article" },
};

/**
 * Tailark Pro `grid-2-customer-story-one` composition. Editorial
 * customer-story detail page wrapped in two stacked grid-2
 * `Container`s: title header → two-column body with main content
 * (image + about + PortableText + testimonial) and a sticky
 * sidebar (auto-generated TOC from PortableText h2/h3 + Company
 * card with logo, founded, joined, website). The upstream was
 * Sanity-driven; this port accepts a `story` prop with a sensible
 * mock default so the page renders without a CMS connection.
 * Light + dark theme.
 */
export const customerStory03Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-03-article" },
  seo,
} as const;
