/**
 * Production route table. Built from the `pages` map in `@indiecrafts/config` —
 * adding a static route is one entry there. This file just turns the map
 * into the array + PATHNAMES table that `i18n/routing.ts` and
 * `sitemap.ts` consume.
 */

import { pages } from "@/config";
import type { PageConfig } from "@/config";

export const ROUTES: readonly PageConfig[] = Object.values(pages);

/**
 * Dynamic routes that don't belong in the `pages` map (one entry per
 * URL pattern, not per content item). Sitemap + llms.txt iterate ROUTES
 * and ignore these; only next-intl's pathname rewriting + the typed
 * `Link` / `getPathname` need them.
 */
const DYNAMIC_PATHNAMES = {
  "/blog/[slug]": "/blog/[slug]",
  "/blog/category/[slug]": "/blog/category/[slug]",
  "/blog/tag/[slug]": "/blog/tag/[slug]",
  "/author/[slug]": "/author/[slug]",
} as const;

export const PATHNAMES = {
  ...Object.fromEntries(ROUTES.map((r) => [r.key, r.slug])),
  ...DYNAMIC_PATHNAMES,
} as Record<string, PageConfig["slug"]>;
