/**
 * Production route table. Built from the `pages` map in `@/config` —
 * adding a route is one entry there. This file just turns the map into the
 * array + PATHNAMES table that `i18n/routing.ts` and `sitemap.ts` consume.
 *
 * No per-route edits here.
 */

import { pages } from "@/config";
import type { PageConfig } from "@/config";

export const ROUTES: readonly PageConfig[] = Object.values(pages);

export const PATHNAMES = Object.fromEntries(ROUTES.map((r) => [r.key, r.slug])) as Record<
  string,
  PageConfig["slug"]
>;
