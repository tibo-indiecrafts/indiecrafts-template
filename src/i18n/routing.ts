/**
 * next-intl routing definition. PATHNAMES is auto-discovered from every
 * `page.config.ts` under `app/[locale]/` via `src/app/routes.ts` — no
 * per-route import here.
 *
 * Components should always import `Link` / `useRouter` / `redirect` /
 * `getPathname` from `@/i18n/routing`, never from `next/link` or
 * `next-intl/navigation` directly.
 */

import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import {
  defaultLocale,
  localeCodes,
  type Locale,
  type StaticAppPathname,
} from "@/config";
import { PATHNAMES } from "@/app/routes";

export const routing = defineRouting({
  locales: [...localeCodes],
  defaultLocale: defaultLocale,
  localePrefix: "as-needed",
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
 * only accepts the unions defined in `@/config`.
 */
type PathnameArg = Parameters<typeof getPathname>[0]["href"];
export function getStaticPathname(href: StaticAppPathname, locale: Locale): string {
  return getPathname({ href: href as PathnameArg, locale });
}
