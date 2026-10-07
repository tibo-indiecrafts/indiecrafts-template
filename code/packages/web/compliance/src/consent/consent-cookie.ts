/**
 * Mirror the decided consent version into a first-party cookie the server can read.
 *
 * @see docs/reference/packages/web/compliance/src/consent/consent-cookie.md
 */
import { site } from "@indiecrafts/packages-shared-config";

/**
 * Holds the consent `version` the visitor decided — never the choices, which stay in
 * `localStorage`. The server reads it in the layout to render the banner for an undecided
 * visitor in the first HTML, instead of after hydration (the late banner was the page's
 * largest paint). Namespaced by `site.prefix`, like `STORAGE_KEY` and `legal-ack`.
 * Framework-free and `typeof`-guarded: safe to import from a server component.
 */
export const CONSENT_COOKIE = `${site.prefix}.consent-v`;

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Write the decided `version` (client-side). First-party, `SameSite=Lax`, `Secure` on
 *  https, 1-year max-age. Strictly-necessary storage — declared in the cookie policy. */
export function writeConsentCookie(version: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(version)}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}
