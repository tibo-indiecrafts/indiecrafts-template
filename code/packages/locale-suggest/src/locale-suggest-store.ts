/**
 * Locale-suggestion dismiss deposit — a small first-party cookie recording that the
 * visitor answered the suggestion (switched or declined), so the server stops
 * showing it. Mirrors the consent/announcement cookie stores.
 */

import { site } from "@indiecrafts/config";

/** Cookie name, namespaced by `site.prefix`. Presence = don't suggest again. */
export const LOCALE_SUGGEST_COOKIE = `${site.prefix}.locale-suggest`;

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Remember that the suggestion was answered (client-side, on switch or dismiss). */
export function dismissLocaleSuggest() {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LOCALE_SUGGEST_COOKIE}=1; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
