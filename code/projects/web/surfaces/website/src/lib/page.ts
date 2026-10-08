/**
 * Fetch a page-builder page by slug from Sanity.
 *
 * @see docs/reference/projects/web/website/src/lib/page.md
 */
import { cache } from "react";
import type { Locale } from "@/config";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { logger } from "@indiecrafts/packages-shared-logger";
import { pageBySlugQuery } from "@/sanity/page-queries";

/**
 * A generic page-builder page by slug + locale. Sole runtime source; React
 * `cache()`, `null`-on-error so a Sanity hiccup 404s instead of throwing. Hidden
 * sections are dropped in GROQ. Read by the `/[locale]/[...slug]` route.
 */
export const getPage = cache(async (slug: string, locale: Locale) => {
  try {
    return (await client.fetch(pageBySlugQuery, { slug, locale })) ?? null;
  } catch (error) {
    logger.error("getPage failed", { slug, locale, error });
    return null;
  }
});
