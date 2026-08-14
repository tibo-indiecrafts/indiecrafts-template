/**
 * Per-request i18n config. The active locale's chrome strings are owned in
 * Sanity (`uiMessages.<locale>`, read by `getUiMessages`) and **overlaid on the
 * bundled `messages/<locale>.json` fallback** — Sanity is the edit surface, the
 * JSON file is the resilience net (a Sanity hiccup never blanks the chrome, and
 * `typography` — technical i18n/format rules — stays in the file, never in the
 * CMS). Every `t(...)` call site is unchanged; only the source moved.
 *
 * next-intl calls this automatically via the plugin in next.config.ts.
 */

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { getUiMessages } from "@/lib/ui-messages";
import { overlayMessages } from "@/lib/overlay-messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const fallback = (await import(`../../messages/${locale}.json`)).default;
  const overrides = await getUiMessages(locale);
  const messages = overlayMessages(fallback, overrides) as Record<string, unknown>;

  return { locale, messages };
});
