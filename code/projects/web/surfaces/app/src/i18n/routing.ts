/**
 * next-intl routing for the `app` surface — parity with the website's locale
 * detection + redirection (`as-needed` prefixes, `localeDetection`, the namespaced
 * locale cookie), minus the website's localized `pathnames` map (this surface has no
 * localized route table yet). Components import `Link`/`useRouter`/`redirect` from
 * here, never `next/link` or `next-intl/navigation`.
 */

import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { i18n, localeCodes, localeCookieName } from "@/config";

export const routing = defineRouting({
  locales: [...localeCodes],
  defaultLocale: i18n.defaultLocale,
  localePrefix: i18n.localePrefix,
  localeDetection: i18n.localeDetection,
  // Namespaced per deployment (`site.prefix`) so two instances on a shared origin
  // don't share the visitor's language choice.
  localeCookie: { name: localeCookieName },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
