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

/**
 * Tailark Pro `libre-customer-story-one` composition. Editorial
 * customer-story detail page: breadcrumb → title + lead paragraph
 * → 2-column body (hero image + PortableText body + testimonial
 * alongside a sticky sidebar with auto-generated "On this page"
 * TOC + Founded/Joined/Website meta) → "Back to Customer Stories"
 * footer link. The upstream was Sanity-driven; this port accepts
 * a `story` prop with a sensible mock default so the page renders
 * without a CMS connection. Light + dark theme.
 */
export const customerStory04Defaults = {
  layout: "default" as LayoutName,
  sectionIds: { article: "customer-story-04-article" },
  seo,
} as const;
