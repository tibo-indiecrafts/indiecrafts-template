/**
 * Fetch the homepage page-builder blocks for a locale from Sanity.
 *
 * @see docs/reference/projects/web/website/src/lib/home.md
 */
import { cache } from "react";
import type { Locale } from "@/config";
import type { AnyModule, SidebarField } from "@indiecrafts/modules-web-blog/sanity/types";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { logger } from "@indiecrafts/packages-shared-logger";
import { homePageQuery } from "@/sanity/home-queries";
import { siteBlocks } from "@/lib/sidebar";

/**
 * The homepage's page-builder blocks for a locale, read from the `page` document
 * with `isHome` on. Sole runtime source (no `messages` fallback); mirrors
 * `getSiteSeo` — React `cache()`, empty-on-error so a Sanity hiccup renders an empty
 * page instead of throwing. Hidden blocks are dropped in GROQ, blog blocks when the blog
 * is off (`siteBlocks`).
 */
export type HomePage = { pageModules: AnyModule[]; sidebar: SidebarField };

const EMPTY: HomePage = { pageModules: [], sidebar: null };

export const getHomePage = cache(async (locale: Locale): Promise<HomePage> => {
  try {
    const data = await client.fetch(homePageQuery, { locale });
    return {
      pageModules: siteBlocks((data?.pageModules ?? []) as AnyModule[]),
      sidebar: (data?.sidebar ?? null) as SidebarField,
    };
  } catch (error) {
    logger.error("getHomePage failed", { locale, error });
    return EMPTY;
  }
});
