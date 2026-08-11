import type { Locale } from "@/config";

/**
 * `new Intl.DateTimeFormat()` loads and allocates locale-data tables on every
 * construction — wasteful when it runs per render or per list item (e.g. a
 * blog card in a grid). Build one formatter per (locale, style) and reuse it.
 * See react-doctor js-hoist-intl.
 */
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(locale: Locale, month: "short" | "long"): Intl.DateTimeFormat {
  const key = `${locale}:${month}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month,
      day: "numeric",
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Format a post's publish date for `locale` (e.g. `"Jul 14, 2026"`), or `null`
 * when there's no date. Pass `month: "long"` for the fuller `"July 14, 2026"`.
 */
export function formatPostDate(
  locale: Locale,
  iso?: string | null,
  { month = "short" }: { month?: "short" | "long" } = {},
): string | null {
  if (!iso) return null;
  return formatterFor(locale, month).format(new Date(iso));
}
