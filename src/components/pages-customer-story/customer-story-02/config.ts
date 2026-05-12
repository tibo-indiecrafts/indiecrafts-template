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

/**
 * Tailark Pro `grid-1-customer-story-one` composition. Editorial
 * customer-story detail page wrapped in the grid-1 `Container`
 * (dashed-decorator chrome): centered breadcrumb (Slash separator)
 * → centered title → wide hero image (max-w-4xl) → about lead →
 * 3-col metadata grid → PortableText body → pull-quote
 * testimonial. The upstream was Sanity-driven; this port accepts a
 * `story` prop with a sensible mock default so the page renders
 * without a CMS connection. Light + dark theme.
 */
export const customerStory02Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-02-article" },
  seo,
} as const;
