/**
 * `@/config` — this app's config home. Re-exports the shared WEB config
 * primitives from `@indiecrafts/packages-shared-config` (i18n · format · env/CSP · site env ·
 * logging · the page-config contract). Add app-owned **instance** config here
 * — theme, fonts, feature flags, nav — so it ships its own, not the shared
 * package's.
 *
 * Rule: app code imports from `@/config`; packages/modules import
 * `@indiecrafts/packages-shared-config` directly. See `code/docs/shared/architecture/multi-app.md`.
 */
import type { ConsentConfig } from "@indiecrafts/packages-shared-compliance/shared";

export * from "@indiecrafts/packages-shared-config";

/**
 * Instance feature flags. `requireConsent` is OFF by default (mirroring the website's
 * `requireCookieConsent`) — the consent UI is compliant-ready, a client flips this on
 * when the surface ships an analytics/ads SDK. `deleteAccount` gates the self-service
 * "Delete my account" page at `/account` (also requires Clerk + `NEXT_PUBLIC_API_URL`).
 * `exportAccount` gates the "Download my data" control on the same page.
 */
export const features = {
  requireConsent: false,
  deleteAccount: true,
  exportAccount: true,
} as const;

/**
 * Consent geo config — flexible + regulation-named. `regulations` adds/overrides named
 * regulations (built-ins: GDPR / UK GDPR / CCPA / None); `overrides` assigns a regulation key
 * to a country/territory (uppercase ISO-3166-1 alpha-2, cascades from a parent country). The
 * built-in map already covers EU/EEA/UK + territories, the US + territories, and everything
 * else — empty = defaults. e.g.
 * `{ regulations: { lgpd: { name: "LGPD", mode: "opt-in" } }, overrides: { BR: "lgpd", CH: "gdpr" } }`.
 */
export const consent: ConsentConfig = {
  overrides: {},
};

/**
 * The current compliance-document version. Bumping it re-prompts the visitor to review
 * & accept the updated legal documents (and re-asks for consent). Mirror it with the
 * website's `getConsentPolicyVersion` when the policies actually change.
 */
export const policyVersion = "2026-01";
