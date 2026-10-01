/**
 * Per-request i18n config — the active locale's chrome from the bundled
 * `messages/<locale>.json`. No Sanity overlay (admin has no CMS); the JSON files are
 * the sole source. next-intl calls this via the plugin in next.config.ts.
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
  // Explicit UTC: the Worker runs in UTC, and operators compare these times with api logs.
  return { locale, messages, timeZone: "UTC" };
});
