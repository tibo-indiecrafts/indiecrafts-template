import {
  defaultLocale,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import type { LocaleString } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Resolve a `localeString` value (`{ en, fr }`) for the active locale, falling
 * back to the default locale, then a caller-supplied default. Mirrors the app's
 * navigation `localized()` so editor-managed per-locale copy renders the same
 * way everywhere.
 */
export function localized(
  value: LocaleString | undefined,
  locale: Locale,
  fallback = "",
): string {
  return value?.[locale] ?? value?.[defaultLocale] ?? fallback;
}
