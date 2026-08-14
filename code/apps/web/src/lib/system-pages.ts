/**
 * Editor copy for the system pages (maintenance + 404), read from the per-locale
 * `siteMeta.<locale>` singleton. UNLIKE the SEO surface, this keeps
 * `messages/<locale>.json` as a guaranteed fallback — these pages are the site's
 * failure safety net, so the caller uses `sanity ?? t(key)` per field and this
 * fetcher returns an empty shape on any error (never throws).
 *
 * The 500 error page is NOT here: it's a Next client error boundary that can't
 * safely fetch, and it must render even when Sanity is what's down.
 */

import { cache } from "react";
import type { Locale } from "@indiecrafts/config";
import { client } from "@indiecrafts/sanity/client";
import {
  systemPagesQuery,
  taxonomyPagesQuery,
  versionPromptQuery,
} from "@/sanity/seo-queries";

export type SystemPages = {
  maintenance?: {
    status?: string;
    title?: string;
    body?: string;
    contact?: string;
  };
  notFound?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    homeLabel?: string;
  };
};

export const getSystemPages = cache(async (locale: Locale): Promise<SystemPages> => {
  try {
    const data = await client.fetch(systemPagesQuery, { id: `siteMeta.${locale}` });
    return data ?? {};
  } catch {
    return {};
  }
});

/** Editorial copy for one taxonomy-index page (heading + intro + empty states). */
export type TaxonomyPageCopy = {
  heading?: string;
  subheading?: string;
  empty?: string;
};

export type TaxonomyPages = {
  category?: TaxonomyPageCopy;
  tag?: TaxonomyPageCopy;
  author?: TaxonomyPageCopy;
};

/**
 * Taxonomy-index page copy from `siteMeta.<locale>.taxonomyPages`. Like the
 * system pages, the caller uses `sanity ?? t(messageKey)` per field (these are
 * always-rendered UI strings), and this returns empty on any error.
 */
export const getTaxonomyPages = cache(async (locale: Locale): Promise<TaxonomyPages> => {
  try {
    const data = await client.fetch(taxonomyPagesQuery, { id: `siteMeta.${locale}` });
    return data ?? {};
  } catch {
    return {};
  }
});

/** Version-update banner copy from `siteMeta.<locale>.versionPrompt`. */
export type VersionPrompt = {
  message?: string;
  reload?: string;
  dismiss?: string;
};

/**
 * Version-update banner copy. UNLIKE the system/taxonomy pages, there is NO
 * `messages` fallback — an unset banner is simply off (the layout mounts it only
 * when all three strings are present). Returns empty on any error.
 */
export const getVersionPrompt = cache(async (locale: Locale): Promise<VersionPrompt> => {
  try {
    const data = await client.fetch(versionPromptQuery, { id: `siteMeta.${locale}` });
    return data ?? {};
  } catch {
    return {};
  }
});
