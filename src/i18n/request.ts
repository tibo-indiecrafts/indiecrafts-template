/**
 * Per-request i18n config — loads the active locale's single flat message
 * tree from `messages/<locale>.json`. No build-time merge, no per-route
 * aggregation, no per-block bake-in: every key the app reads at runtime
 * lives in that one file, including page content and block copy nested
 * under `pages.<id>.blocks.<simple>.*`.
 *
 * next-intl calls this automatically via the plugin in next.config.ts.
 */

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages };
});
