import { SUPPORTED_LOCALES, type Locale } from "@/config/locales.config";
import type { LocalizedSlug } from "./types";

/**
 * Expand a LocalizedSlug into an entry accepted by next-intl's pathnames
 * table. A plain string stays a string; a per-locale map is filled in for
 * every supported locale, defaulting missing locales to English (or the
 * first non-empty value). Per-locale custom URLs are fully preserved
 * (e.g., `{ en: "/about", fr: "/a-propos" }` round-trips intact).
 */
export function expandSlug(slug: LocalizedSlug): string | Record<Locale, string> {
  if (typeof slug === "string") return slug;
  const fallback = slug.en ?? Object.values(slug).find((v) => !!v) ?? "/";
  const out = {} as Record<Locale, string>;
  for (const locale of SUPPORTED_LOCALES) {
    out[locale] = slug[locale] ?? fallback;
  }
  return out;
}
