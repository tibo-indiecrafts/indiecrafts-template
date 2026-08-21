import {
  defaultLocale,
  formatDefaults,
  localeFormat,
  type Locale,
} from "@indiecrafts/packages-shared-config";

/**
 * Money formatting + math. `formatMoney` is the display path (memoized
 * `Intl.NumberFormat` currency); `convert`/`withVat` are the compute path
 * (rates + VAT from `formatDefaults`, never hardcoded). Amounts are major units
 * by default; pass `cents:true` for minor-unit inputs (Stripe).
 */

const cache = new Map<string, Intl.NumberFormat>();

export type MoneyOptions = {
  locale?: Locale;
  /** ISO 4217 (e.g. `"EUR"`). Defaults to the locale's `currency`, else `formatDefaults.currency`. */
  currency?: string;
  /** Input is in minor units (cents) — divide by 100. */
  cents?: boolean;
};

export function formatMoney(
  amount: number,
  { locale = defaultLocale, currency, cents = false }: MoneyOptions = {},
): string {
  const f = localeFormat(locale);
  const cur = (currency ?? f.currency).toUpperCase();
  const key = `${f.numberLocale}:${cur}`;
  let fmt = cache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(f.numberLocale, {
      style: "currency",
      currency: cur,
    });
    cache.set(key, fmt);
  }
  return fmt.format(cents ? amount / 100 : amount);
}

/** Parse a loose money string to a number — strips symbols, handles `1.234,56` (EU) and `1,234.56` (US). */
export function parseMoney(input: string): number {
  const s = input.replace(/[^\d.,-]/g, "").trim();
  if (!s) return Number.NaN;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  // The right-most of `,`/`.` is the decimal separator; the other groups thousands.
  const normalized =
    lastComma > lastDot
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  return Number.parseFloat(normalized);
}

export const toMajor = (cents: number): number => cents / 100;
export const toCents = (major: number): number => Math.round(major * 100);

const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Convert between currencies using the `rates` table (keyed `"FROM>TO"`). Uses the
 * inverse pair when only one direction is listed. Throws when no rate exists —
 * conversion must be explicit, never silently wrong.
 */
export function convert(
  amount: number,
  {
    from,
    to,
    rates = formatDefaults.rates,
  }: { from: string; to: string; rates?: Record<string, number> },
): number {
  const a = from.toUpperCase();
  const b = to.toUpperCase();
  if (a === b) return amount;
  const direct = rates[`${a}>${b}`];
  const inverse = rates[`${b}>${a}`];
  const rate = direct ?? (inverse ? 1 / inverse : undefined);
  if (rate == null)
    throw new Error(
      `No conversion rate for ${a}>${b} (add it to formatDefaults.rates)`,
    );
  return round2(amount * rate);
}

/** Gross (TTC) from net (HT). */
export const withVat = (
  net: number,
  rate: number = formatDefaults.vatRate,
): number => round2(net * (1 + rate));
/** Net (HT) from gross (TTC). */
export const netFromGross = (
  gross: number,
  rate: number = formatDefaults.vatRate,
): number => round2(gross / (1 + rate));
