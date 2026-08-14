import "server-only";

import { notFound } from "next/navigation";
import { features, isPageVisible, pages, type PageConfig } from "@indiecrafts/config";
import { getBlogSettings } from "./settings";

/**
 * Single source of truth for gating the public blog surface. A blog route
 * is reachable only when the `blog` feature is on AND its page entry is
 * enabled (`enabled !== false`). Both checks live here so a new blog route
 * can't drift by forgetting one half.
 *
 * The Studio + draft-mode editing surface is gated separately by
 * `features.studio` — see `@indiecrafts/config`.
 */
export function isBlogRouteEnabled(page: PageConfig): boolean {
  return features.blog && isPageVisible(page);
}

/**
 * Guard for blog page components (Server Components): 404s when the blog
 * feature is off or the page entry is disabled. Route handlers that must
 * return a `Response` should call `isBlogRouteEnabled` directly instead.
 */
export function requireBlogRoute(page: PageConfig): void {
  if (!isBlogRouteEnabled(page)) notFound();
}

/**
 * The RSS feed is a blog surface, so it requires the blog to be reachable
 * AND its own `rss` flag. Drives both the `/blog/rss.xml` handler and the
 * `<link rel="alternate" application/rss+xml>` discovery tags on blog pages.
 */
export function isRssEnabled(): boolean {
  return isBlogRouteEnabled(pages.blog) && features.rss;
}

/**
 * Comments are a blog surface: gated by the blog flag AND `blogComments`.
 * Drives the `/api/comments` route + whether the `<Comments>` section renders.
 */
export function isCommentsEnabled(): boolean {
  return features.blog && features.blogComments;
}

/**
 * Search is a blog surface: gated by the blog flag AND `blogSearch`. Drives
 * the `/blog/search` route (404 when off) + whether the search box renders.
 */
export function isSearchEnabled(): boolean {
  return isBlogRouteEnabled(pages.blog) && features.blogSearch;
}

/**
 * Series are a blog surface: gated by the blog flag AND `blogSeries`. Drives
 * the `/blog/series/<slug>` route + the on-post "Part N of M" nav + the
 * sitemap series entries.
 */
export function isSeriesEnabled(): boolean {
  return isBlogRouteEnabled(pages.blog) && features.blogSeries;
}

/** The three taxonomy surfaces — keys match `blog.display.taxonomy.*`. */
export type TaxonomyKind = "categories" | "tags" | "authors";

/**
 * A taxonomy route (author / category / tag) is reachable only when its page
 * is code-enabled (`isBlogRouteEnabled`) AND the editor's display toggle is on
 * (`blog.display.taxonomy.*` in Sanity). Turning a taxonomy off in the Studio
 * therefore 404s its routes and drops them from sitemap + llms — "off = truly
 * gone", no deploy. Async because it reads the blog singleton.
 */
export async function isTaxonomyRouteEnabled(
  kind: TaxonomyKind,
  page: PageConfig,
): Promise<boolean> {
  if (!isBlogRouteEnabled(page)) return false;
  return (await getBlogSettings()).taxonomy[kind];
}

/**
 * Guard for taxonomy page components (Server Components): 404s when the code
 * flag is off OR the editor toggled the taxonomy off. `generateStaticParams`
 * should call `isTaxonomyRouteEnabled` and return `[]` instead.
 */
export async function requireTaxonomyRoute(
  kind: TaxonomyKind,
  page: PageConfig,
): Promise<void> {
  if (!(await isTaxonomyRouteEnabled(kind, page))) notFound();
}
