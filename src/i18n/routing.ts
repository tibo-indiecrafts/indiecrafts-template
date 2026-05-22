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
import { defaultLocale, localeCodes } from "@/config";
import { PATHNAMES } from "@/app/routes";

export const routing = defineRouting({
  locales: [...localeCodes],
  defaultLocale: defaultLocale,
  localePrefix: "as-needed",
  pathnames: PATHNAMES,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
