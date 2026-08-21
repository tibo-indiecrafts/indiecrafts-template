/**
 * Shared next-intl navigation for modules (and the app's non-typed sites).
 * Prefix-aware but NOT pathname-typed — modules pass string hrefs / use
 * `localizedPathname` from @indiecrafts/packages-shared-config. The app keeps its own typed
 * routing (with `PATHNAMES`) in `src/i18n/routing.ts` for typed links.
 */
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { i18n, localeCodes } from "@indiecrafts/packages-shared-config";

export const routing = defineRouting({
  locales: [...localeCodes],
  defaultLocale: i18n.defaultLocale,
  localePrefix: i18n.localePrefix,
  localeDetection: i18n.localeDetection,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export { localizedPathname } from "@indiecrafts/packages-shared-config";
export {
  useLocaleSwitch,
  LocaleSwitchProvider,
  type TranslatedPathResolver,
} from "./use-locale-switch";
