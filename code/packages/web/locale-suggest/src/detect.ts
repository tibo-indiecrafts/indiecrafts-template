/**
 * Pure locale-preference detector — no framework, cheap to unit-test. next-intl
 * already redirects a FIRST visit to `/` to the browser language, so this targets
 * the residual mismatch: a returning visitor or a shared `/fr/…` link whose active
 * locale differs from what the browser asks for.
 *
 * Only the HTTP `Accept-Language` PARSER is web-specific; the ranked-preference
 * DECISION is shared (`pickSuggestedLocale`, `@indiecrafts/packages-shared-config`), so
 * the native shells reuse it over `getLocales()` / `navigator.languages`.
 */

import { pickSuggestedLocale } from "@indiecrafts/packages-shared-config/shared";

/**
 * The top-ranked `Accept-Language` locale that's supported and ≠ the active one.
 * Returns `null` when the visitor's first supported preference already matches the
 * active locale (or none is supported) — so no suggestion is shown.
 */
export function detectPreferredLocale(
  acceptLanguage: string | null | undefined,
  active: string,
  locales: readonly string[],
): string | null {
  if (!acceptLanguage) return null;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", q] = part.trim().split(";q=");
      return {
        code: tag.split("-")[0]?.toLowerCase() ?? "",
        q: q ? Number.parseFloat(q) : 1,
      };
    })
    .filter((x) => x.code && !Number.isNaN(x.q))
    .sort((a, b) => b.q - a.q)
    .map((x) => x.code);

  return pickSuggestedLocale(ranked, active, locales);
}
