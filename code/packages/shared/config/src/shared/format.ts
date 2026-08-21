/**
 * Site-wide formatting fallbacks for `@indiecrafts/packages-shared-format` (money/number/date/
 * grammar). Per-locale overrides live on each `i18n.locales` row (`numberLocale`,
 * `currency`, `capitalizeInlineNouns`, `adjBeforeNoun`); these are the defaults when
 * a row omits one. `rates` is the currency-conversion table the project maintains
 * (review it like any pricing input) — empty by default (no conversion until you add
 * pairs).
 */

import type { Locale } from "./types";
import { localeMap } from "./i18n";

/** Site-wide format defaults. Module-internal type. */
type FormatDefaults = {
  currency: string;
  vatRate: number;
  /** Conversion rates keyed `"FROM>TO"` (e.g. `{ "USD>EUR": 0.93 }`). */
  rates: Record<string, number>;
};

export const formatDefaults: FormatDefaults = {
  currency: "EUR",
  vatRate: 0.2,
  rates: {},
};

/** Resolved formatting rules for a locale — its `i18n.locales` row merged over the defaults. */
type LocaleFormat = {
  numberLocale: string;
  currency: string;
  capitalizeInlineNouns: boolean;
  adjBeforeNoun: boolean;
};

/** Resolve a locale's formatting rules (row overrides → defaults → sane fallbacks). */
export function localeFormat(locale: Locale): LocaleFormat {
  const row = localeMap[locale];
  return {
    numberLocale: row?.numberLocale ?? locale,
    currency: row?.currency ?? formatDefaults.currency,
    capitalizeInlineNouns: row?.capitalizeInlineNouns ?? true,
    adjBeforeNoun: row?.adjBeforeNoun ?? true,
  };
}
