import { cache } from "react";
import type { Locale } from "@/config";
import type { BlockModule } from "@indiecrafts/ui-components/shared/types";
import { client } from "@indiecrafts/sanity/client";
import { logger } from "@indiecrafts/logger";
import { homePageQuery } from "@/sanity/home-queries";

/**
 * The homepage's page-builder blocks for a locale, read from the
 * `homePage.<locale>` singleton. Sole runtime source (no `messages` fallback);
 * mirrors `getSiteSeo` — React `cache()`, empty-on-error so a Sanity hiccup
 * renders an empty page instead of throwing. Hidden blocks are dropped in GROQ.
 */
export type HomePage = { pageModules: BlockModule[] };

const EMPTY: HomePage = { pageModules: [] };

export const getHomePage = cache(async (locale: Locale): Promise<HomePage> => {
  try {
    const data = await client.fetch(homePageQuery, { id: `homePage.${locale}` });
    return { pageModules: (data?.pageModules ?? []) as BlockModule[] };
  } catch (error) {
    logger.error("getHomePage failed", { locale, error });
    return EMPTY;
  }
});
