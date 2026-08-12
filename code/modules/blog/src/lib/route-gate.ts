import "server-only";

import { notFound } from "next/navigation";
import { features, isPageVisible, pages, type PageConfig } from "@indiecrafts/config";

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
