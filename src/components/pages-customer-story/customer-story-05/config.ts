import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

export const customerStory05Key = "customer-story-05" as const;
export const customerStory05Namespace = "blocks.customer-story-05" as const;

const seo: PageSeo = {
  titleKey: "blocks.customer-story-05.title",
  descriptionKey: "blocks.customer-story-05.description",
  keywords: ["customer story", "case study", "editorial", "config-first"],
  openGraph: { type: "article" },
};

/**
 * Tailark Pro `dark-customer-story-three` composition. Editorial
 * customer-story detail page: centered breadcrumb (Slash separator)
 * + centered title (`text-3xl md:text-4xl lg:text-5xl`) → wide
 * hero image (full article width) → about lead → 3-col metadata
 * grid → PortableText body → pull-quote testimonial. The upstream
 * was Sanity-driven; this port accepts a `story` prop with a
 * sensible mock default so the page renders without a CMS
 * connection. Light + dark theme.
 */
export const customerStory05Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-05-article" },
  seo,
} as const;
