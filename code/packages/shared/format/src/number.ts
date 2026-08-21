import { defaultLocale, localeFormat, type Locale } from "@indiecrafts/packages-shared-config";

/** Number/percent/compact/unit/ordinal/bytes — all locale-aware, memoized `Intl.NumberFormat`. */

const cache = new Map<string, Intl.NumberFormat>();
function nf(locale: Locale, opts: Intl.NumberFormatOptions): Intl.NumberFormat {
  const bcp47 = localeFormat(locale).numberLocale;
  const key = `${bcp47}:${JSON.stringify(opts)}`;
  let fmt = cache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(bcp47, opts);
    cache.set(key, fmt);
  }
  return fmt;
}

export function formatNumber(
  n: number,
  locale: Locale = defaultLocale,
  opts: Intl.NumberFormatOptions = {},
): string {
  return nf(locale, opts).format(n);
}

/** `ratio` is 0–1 (`0.125` → `"12.5%"` / `"12,5 %"`). */
export function formatPercent(
  ratio: number,
  locale: Locale = defaultLocale,
  decimals = 0,
): string {
  return nf(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(ratio);
}

/** `1234` → `"1.2K"` / `"1,2 k"`. */
export function formatCompact(
  n: number,
  locale: Locale = defaultLocale,
): string {
  return nf(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
    n,
  );
}

/** `5, "kilometer"` → `"5 km"`. `unit` is an ECMAScript sanctioned unit. */
export function formatUnit(
  n: number,
  unit: string,
  locale: Locale = defaultLocale,
  unitDisplay: "short" | "long" | "narrow" = "short",
): string {
  return nf(locale, { style: "unit", unit, unitDisplay }).format(n);
}

/** `10, 20` → `"10–20"`. */
export function formatRange(
  a: number,
  b: number,
  locale: Locale = defaultLocale,
  opts: Intl.NumberFormatOptions = {},
): string {
  return nf(locale, opts).formatRange(a, b);
}

const ordinalCache = new Map<string, Intl.PluralRules>();
// Per-locale ordinal suffixes keyed by the plural category `Intl.PluralRules` returns.
const ORDINAL_SUFFIX: Record<
  string,
  Partial<Record<Intl.LDMLPluralRule, string>>
> = {
  en: { one: "st", two: "nd", few: "rd", other: "th" },
  fr: { one: "er", other: "e" }, // 1er, 2e (masculine)
};
/** `1, "en"` → `"1st"`; `1, "fr"` → `"1er"`. */
export function formatOrdinal(
  n: number,
  locale: Locale = defaultLocale,
): string {
  let pr = ordinalCache.get(locale);
  if (!pr) {
    pr = new Intl.PluralRules(localeFormat(locale).numberLocale, {
      type: "ordinal",
    });
    ordinalCache.set(locale, pr);
  }
  const table = ORDINAL_SUFFIX[locale] ?? ORDINAL_SUFFIX.en;
  return `${n}${table[pr.select(n)] ?? table.other ?? ""}`;
}

/** `1536` → `"1.5 KB"`. Binary (1024) steps; not locale-aware (a technical unit). */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    units.length - 1,
  );
  return `${(bytes / k ** i).toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);
export const roundTo = (n: number, decimals = 2): number => {
  const p = 10 ** decimals;
  return Math.round(n * p) / p;
};
