/**
 * i18n: the languages the site ships, the unprefixed default, how locales appear
 * in URLs, and the derived lookups/helpers. `i18n/routing.ts` + the proxy consume
 * `i18n` directly; the flat aliases below are the stable public API.
 *
 * Add a language: add a row to `i18n.locales` + drop `messages/<code>.json`. The
 * `Locale` union (in `./types`), routing, sitemap, hreflang, llms endpoints, and
 * the locale switcher all follow automatically.
 *
 * Localized slugs: a page's `slug` (in `./pages`) may be a plain string (same path
 * everywhere) OR a `{ [code]: string }` object for per-locale paths.
 */

import type { Locale, LocaleConfig } from "./types";

export const i18n = {
  /** Registered languages. Row order is the locale-switcher menu order. */
  locales: [
    {
      code: "en",
      label: "English",
      abbr: "EN",
      dir: "ltr",
      numberLocale: "en-US",
      currency: "EUR",
      capitalizeInlineNouns: true,
      adjBeforeNoun: true,
    },
    {
      code: "fr",
      label: "Français",
      abbr: "FR",
      dir: "ltr",
      numberLocale: "fr-FR",
      currency: "EUR",
      capitalizeInlineNouns: false,
      adjBeforeNoun: false,
    },
  ],
  /** The unprefixed locale, served at bare paths (`/`, `/blog`). */
  defaultLocale: "en",
  /**
   * How the locale appears in the URL (next-intl `localePrefix`):
   *   - "as-needed" — default locale unprefixed (`/`, `/blog`); others get
   *     `/<code>` (`/fr/blog`). The usual choice.
   *   - "always"    — every locale prefixed (`/en`, `/fr`).
   *   - "never"     — no prefixes; active locale tracked by cookie only.
   */
  localePrefix: "as-needed",
  /**
   * On a first visit to `/`, redirect to the visitor's browser language
   * (Accept-Language) when it's one of `locales`. Their explicit choice (the
   * NEXT_LOCALE cookie) always wins afterwards. `false` = always serve the
   * default locale until the user picks one.
   */
  localeDetection: true,
} as const satisfies {
  locales: readonly LocaleConfig[];
  defaultLocale: string;
  localePrefix: "as-needed" | "always" | "never";
  localeDetection: boolean;
};

// ── Flat aliases + derived helpers (stable public API) ────────

export const locales = i18n.locales;

/**
 * The unprefixed locale. The `: Locale` annotation fails the build if
 * `i18n.defaultLocale` ever names a code that isn't registered above.
 */
export const defaultLocale: Locale = i18n.defaultLocale;

/** Just the codes — the common case, worth the one-line derivation. */
export const localeCodes = locales.map((l) => l.code) as readonly Locale[];

/** O(1) `code → config` lookup. Replaces scattered `locales.find(...)` calls. */
export const localeMap = Object.fromEntries(
  locales.map((l) => [l.code, l]),
) as Record<Locale, LocaleConfig>;

/** Whether `code` is the default (unprefixed) locale. Module-internal. */
const isDefaultLocale = (code: Locale): boolean => code === defaultLocale;

/**
 * The URL path prefix for a locale, honouring `i18n.localePrefix`:
 *   never → `""` · always → `"/<code>"` · as-needed → `""` for the default
 * else `"/<code>"`. Used for manual URL building (sitemap, the llms head
 * link); next-intl drives the live routing itself.
 */
export const localePrefix = (code: Locale): string => {
  // Cast off the `as const` literal so all three modes stay reachable
  // (the value is already constrained by the `satisfies` on `i18n`).
  const mode = i18n.localePrefix as string;
  if (mode === "never") return "";
  if (mode === "always") return `/${code}`;
  return isDefaultLocale(code) ? "" : `/${code}`;
};

/**
 * Locale-aware absolute path for a dynamic detail route whose slug isn't in
 * `PATHNAMES` — blog posts, categories, tags, authors. Mirrors the `as-needed`
 * prefix policy: the default locale gets no prefix, every other locale a `/<locale>`.
 */
export function localizedPathname(
  pathname: `/${string}`,
  locale: Locale,
): string {
  return `${localePrefix(locale)}${pathname}`;
}

/** Text direction for a locale — falls back to `"ltr"` for unknown codes. */
export const localeDir = (code: Locale): "ltr" | "rtl" =>
  localeMap[code]?.dir ?? "ltr";

/**
 * Locale type-guard. Pass the registered `localeCodes`.
 *
 *   import { isLocale, localeCodes } from "@indiecrafts/config";
 *   if (isLocale(input, localeCodes)) { … }
 */
export function isLocale<L extends string>(
  value: string,
  supported: readonly L[],
): value is L {
  return (supported as readonly string[]).includes(value);
}
