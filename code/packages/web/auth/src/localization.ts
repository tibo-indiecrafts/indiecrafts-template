import { enUS, frFR } from "@clerk/localizations";

/**
 * App locale → Clerk UI localization bundle. `fr` → `frFR`, everything else
 * (incl. the default `en`) → `enUS`. Passed to `<ClerkProvider localization>` so
 * Clerk's sign-in/up + user-button + account modal render in the visitor's
 * language. Non-`en-US` bundles are Clerk **community** locales — a few strings
 * may stay English. Extend the map as locales are added.
 */
export function clerkLocalization(locale: string) {
  return locale === "fr" ? frFR : enUS;
}
