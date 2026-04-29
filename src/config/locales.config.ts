/**
 * Locale configuration — the only place to declare which languages ship.
 * Add a locale here, add a messages/<locale>.json file, and it propagates
 * to routing, middleware, sitemap, and the locale switcher.
 */

export const SUPPORTED_LOCALES = ["en", "fr"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Display names shown in the locale switcher, per locale (native name). */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

/** Short uppercase code for compact switcher triggers. */
export const LOCALE_ABBREVIATIONS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
};

/** Text direction per locale — extend when adding RTL languages. */
export const LOCALE_DIRECTIONS: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
};

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
