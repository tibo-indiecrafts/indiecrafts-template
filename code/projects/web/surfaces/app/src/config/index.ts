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
export * from "@indiecrafts/packages-shared-config";

/**
 * Instance feature flags. `requireConsent` is OFF by default (mirroring the website's
 * `requireCookieConsent`) — the consent UI is compliant-ready, a client flips this on
 * when the surface ships an analytics/ads SDK.
 */
export const features = { requireConsent: false } as const;

/**
 * The current compliance-document version. Bumping it re-prompts the visitor to review
 * & accept the updated legal documents (and re-asks for consent). Mirror it with the
 * website's `getConsentPolicyVersion` when the policies actually change.
 */
export const policyVersion = "2026-01";
