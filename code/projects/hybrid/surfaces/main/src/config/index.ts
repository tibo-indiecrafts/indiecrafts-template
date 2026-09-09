/**
 * Config home for this hybrid (Electron) app. Re-exports the PORTABLE config
 * core from `@indiecrafts/packages-shared-config/hybrid` (i18n · format · types — React-free, no
 * web/DOM coupling), usable from the main process AND the renderer. Add
 * hybrid-owned **instance** config here — window, updater channel, native env —
 * as the app grows.
 */
import type { ConsentConfig } from "@indiecrafts/packages-shared-compliance/shared";

export * from "@indiecrafts/packages-shared-config/hybrid";

/**
 * Per-deployment namespace for browser-owned keys (consent record, locale choice) —
 * mirrors the web `site.prefix`. `site` is web-only, so the hybrid owns its prefix here
 * (`VITE_SITE_PREFIX`, else the template default). Set it per client at build.
 */
export const sitePrefix = import.meta.env.VITE_SITE_PREFIX ?? "indiecrafts";

/**
 * Every persisted key, namespaced once under `sitePrefix` — the ONE home for
 * storage-key strings (mirrors the mobile app's `STORAGE_KEYS`). The renderer's
 * stores read a name here; they never build `${sitePrefix}.foo` inline (that drift
 * is how two files disagree on a key). Consumed by `i18n` (locale) + the
 * compliance/announcement/geo stores.
 */
export const STORAGE_KEYS = {
  locale: `${sitePrefix}.locale`,
  cookieConsent: `${sitePrefix}.cookie-consent`,
  legalAck: `${sitePrefix}.legal-ack`,
  announcementAck: `${sitePrefix}.announcement-ack`,
  announcementToastAck: `${sitePrefix}.announcement-toast-ack`,
  // Cached visitor country (from the api `/v1/geo`) for the consent geo decision.
  geoCountry: `${sitePrefix}.geo-country`,
} as const;

/** The marketing-site origin — the legal link-out + version poll target (`VITE_WEBSITE_URL`). */
export const websiteUrl = import.meta.env.VITE_WEBSITE_URL;

/**
 * Canonical web account entry point the desktop shell hands off to (Manage account).
 * Default: the website's `/account`. A project that ships the `app` surface sets
 * `VITE_ACCOUNT_URL` to `https://app.<domain>/account` (the authenticated product surface).
 */
export const accountUrl =
  import.meta.env.VITE_ACCOUNT_URL ??
  (websiteUrl ? `${websiteUrl}/account` : undefined);

/** The shared api Worker origin — the announcements read target (`VITE_API_URL`). */
export const apiUrl = import.meta.env.VITE_API_URL;

/** The build id baked in at build (`VITE_BUILD_ID`, else `"dev"`) — the version-check baseline. */
export const buildId = import.meta.env.VITE_BUILD_ID ?? "dev";

/**
 * Instance feature flags. `requireConsent` is OFF by default (mirroring the website's
 * `requireCookieConsent`) — the consent UI is compliant-ready, a client flips this on
 * when the app ships an analytics/ads SDK. `deleteAccount` gates the self-service GDPR
 * erasure control in the signed-in view; `exportAccount` gates the self-service data-export
 * control alongside it.
 */
export const features = {
  requireConsent: false,
  deleteAccount: true,
  exportAccount: true,
} as const;

/**
 * Consent geo config — flexible + regulation-named. `regulations` adds/overrides named
 * regulations (built-ins: GDPR / UK GDPR / CCPA / None); `overrides` assigns a regulation key
 * to a country/territory (uppercase ISO-3166-1 alpha-2, cascades from a parent country). Empty
 * = the built-in defaults. e.g.
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
