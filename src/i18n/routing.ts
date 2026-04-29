/**
 * next-intl routing definition — wires config/locales + config/routes into the
 * navigation helpers used across the app.
 *
 * Components should always import from `@/i18n/routing`, never from
 * `next-intl/navigation` directly, so locale-aware Link/redirect are used.
 */

import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/config/locales.config";
import { PATHNAMES } from "@/config/routes.config";

export const routing = defineRouting({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
  pathnames: PATHNAMES,
});

export type AppPathname = keyof typeof routing.pathnames;

/** AppPathnames without dynamic segments — safe to pass directly to <Link href>. */
export type StaticAppPathname = {
  [K in AppPathname]: K extends `${string}[${string}]${string}` ? never : K;
}[AppPathname];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
