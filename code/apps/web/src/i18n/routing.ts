/**
 * next-intl routing definition. PATHNAMES is assembled from the `pages`
 * map in `@indiecrafts/config` via `src/app/routes.ts` — no per-route import here.
 *
 * Components should always import `Link` / `useRouter` / `redirect` /
 * `getPathname` from `@/i18n/routing`, never from `next/link` or
 * `next-intl/navigation` directly.
 */

import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import {
  i18n,
  localeCodes,
  type Locale,
  type StaticAppPathname,
} from "@indiecrafts/config";
import { PATHNAMES } from "@/app/routes";

export const routing = defineRouting({
  locales: [...localeCodes],
  defaultLocale: i18n.defaultLocale,
  localePrefix: i18n.localePrefix,
  localeDetection: i18n.localeDetection,
  pathnames: PATHNAMES,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

/**
 * Type-safe wrapper around `getPathname` for our static routes.
 *
 * `PATHNAMES` is widened to `Record<string, ...>` in `src/app/routes.ts`
 * so it can be assembled dynamically from the `pages` map. That widening
 * means next-intl's strict `Pathname` union can't statically match a
 * `StaticAppPathname` literal — calling `getPathname({ href, locale })`
 * directly with our project types would require a cast at every site.
 *
 * Keep the cast contained here. Callers get a typed entry point that
 * only accepts the unions defined in `@indiecrafts/config`.
 */
type PathnameArg = Parameters<typeof getPathname>[0]["href"];
export function getStaticPathname(href: StaticAppPathname, locale: Locale): string {
  return getPathname({ href: href as PathnameArg, locale });
}

// `localizedPathname` is config-only (no app routes) — it lives in @indiecrafts/config
// so modules can use it too; re-exported here for the app's existing import sites.
export { localizedPathname } from "@indiecrafts/config";
