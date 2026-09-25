/**
 * Format relative time, durations, and date ranges per locale.
 *
 * @see docs/reference/packages/shared/format/src/relative.md
 */
import {
  defaultLocale,
  localeFormat,
  type Locale,
} from "@indiecrafts/packages-shared-config/shared";

/** Relative time ("3 days ago" / "il y a 3 jours"), durations, and date ranges — all i18n via `Intl`. */

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();
function rtf(locale: Locale): Intl.RelativeTimeFormat {
  const bcp47 = localeFormat(locale).numberLocale;
  let fmt = rtfCache.get(bcp47);
  if (!fmt) {
    // `numeric:"auto"` yields "yesterday"/"hier" instead of "1 day ago".
    fmt = new Intl.RelativeTimeFormat(bcp47, { numeric: "auto" });
    rtfCache.set(bcp47, fmt);
  }
  return fmt;
}

// Cascading divisions: seconds → … → years.
const DIVISIONS: [number, Intl.RelativeTimeFormatUnit][] = [
  [60, "second"],
  [60, "minute"],
  [24, "hour"],
  [7, "day"],
  [4.34524, "week"],
  [12, "month"],
  [Number.POSITIVE_INFINITY, "year"],
];

/** Localized relative time from a Date/ISO/epoch. Negative = past. `now` overridable for tests. */
export function formatRelativeTime(
  input: Date | string | number,
  locale: Locale = defaultLocale,
  now: number = Date.now(),
): string {
  const then = new Date(input).getTime();
  let duration = (then - now) / 1000; // seconds; < 0 = past
  for (const [amount, unit] of DIVISIONS) {
    if (Math.abs(duration) < amount)
      return rtf(locale).format(Math.round(duration), unit);
    duration /= amount;
  }
  return rtf(locale).format(Math.round(duration), "year");
}

/** Minutes → `"5 min"` (locale-formatted number + narrow unit). The "read"/"de lecture" suffix is UI copy. */
export function formatDuration(
  minutes: number,
  locale: Locale = defaultLocale,
): string {
  return new Intl.NumberFormat(localeFormat(locale).numberLocale, {
    style: "unit",
    unit: "minute",
    unitDisplay: "short",
  }).format(minutes);
}

/** Seconds → clock `"1:23:45"` / `"4:05"` (padded, hours dropped when zero). */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

const dtrCache = new Map<string, Intl.DateTimeFormat>();
/** `"14–16 Jul 2026"` — one `Intl.DateTimeFormat.formatRange`. */
export function formatDateRange(
  a: Date | string | number,
  b: Date | string | number,
  locale: Locale = defaultLocale,
  opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
): string {
  const bcp47 = localeFormat(locale).numberLocale;
  const key = `${bcp47}:${JSON.stringify(opts)}`;
  let fmt = dtrCache.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(bcp47, opts);
    dtrCache.set(key, fmt);
  }
  return fmt.formatRange(new Date(a), new Date(b));
}
