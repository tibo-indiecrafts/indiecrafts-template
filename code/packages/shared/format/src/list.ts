/**
 * Join a list of strings with locale-aware conjunctions.
 *
 * @see docs/reference/packages/shared/format/src/list.md
 */
import {
  defaultLocale,
  localeFormat,
  type Locale,
} from "@indiecrafts/packages-shared-config/shared";

/** Locale-aware list joining ("A, B and C" / "A, B et C") via `Intl.ListFormat`. */

const cache = new Map<string, Intl.ListFormat>();

export type ListOptions = {
  type?: "conjunction" | "disjunction" | "unit";
  style?: "long" | "short" | "narrow";
};

export function formatList(
  items: string[],
  locale: Locale = defaultLocale,
  { type = "conjunction", style = "long" }: ListOptions = {},
): string {
  const bcp47 = localeFormat(locale).numberLocale;
  const key = `${bcp47}:${type}:${style}`;
  let fmt = cache.get(key);
  if (!fmt) {
    fmt = new Intl.ListFormat(bcp47, { type, style });
    cache.set(key, fmt);
  }
  return fmt.format(items.filter(Boolean));
}

/** First `max` items joined, then a `+N` overflow marker: `"A, B, C +2"`. The "more" word is UI copy. */
export function joinTruncated(
  items: string[],
  locale: Locale = defaultLocale,
  max = 3,
): string {
  const kept = items.filter(Boolean);
  if (kept.length <= max) return formatList(kept, locale);
  const rest = kept.length - max;
  return `${kept.slice(0, max).join(", ")} +${rest}`;
}
