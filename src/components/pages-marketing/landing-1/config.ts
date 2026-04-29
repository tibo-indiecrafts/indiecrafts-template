import type { LayoutName } from "@/components/layouts/registry";
import type { PageSeo } from "@/config/pages/types";

/**
 * Block key — kebab-case folder name. Used to look up translations under
 * `blocks.<key>.*`.
 */
export const landing1Key = "landing-1" as const;

/**
 * Translation namespace — `useTranslations(landing1Namespace)` resolves keys
 * from `en.json` at runtime.
 */
export const landing1Namespace = "blocks.landing-1" as const;

/**
 * SEO defaults shipped with the template. Routes import them and pass them
 * into `buildMetadata` — clients override per-route by spreading then
 * setting individual fields:
 *
 *   buildMetadata({
 *     page: { ...routeMeta, seo: { ...landing1Defaults.seo, keywords: [...] } },
 *     locale,
 *   });
 */
const seo: PageSeo = {
  titleKey: "blocks.landing-1.title",
  descriptionKey: "blocks.landing-1.description",
  keywords: ["next.js template", "config-first", "modular website", "i18n"],
  openGraph: { type: "website" },
};

/**
 * Structural defaults — non-translatable. Override by passing props at
 * the component callsite, or edit this file directly when customizing
 * the template for a specific project.
 */
export const landing1Defaults = {
  layout: "default" as LayoutName,
  /** Section ids — make them stable so analytics/anchors don't drift. */
  sectionIds: {
    features: "landing-1-features",
    cta: "landing-1-cta",
    pricing: "landing-1-pricing",
    testimonials: "landing-1-testimonials",
  },
  seo,
} as const;
