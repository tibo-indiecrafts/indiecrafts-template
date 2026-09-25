/**
 * Resolve a per-locale blog string with a default fallback.
 *
 * @see docs/reference/modules/web/blog/src/lib/localize.md
 */
import { pickLocale, type Locale } from "@indiecrafts/packages-shared-config";
import type { LocaleString } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Resolve a `localeString` value (`{ en, fr }`) for the active locale, falling
 * back to the default locale, then a caller-supplied default. Thin blog-typed
 * adapter over the shared {@link pickLocale} so editor-managed per-locale copy
 * renders the same way everywhere.
 */
export function localized(
  value: LocaleString | undefined,
  locale: Locale,
  fallback = "",
): string {
  return pickLocale(value, locale, fallback);
}
