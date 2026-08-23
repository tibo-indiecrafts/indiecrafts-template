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

/** The marketing-site origin — the legal link-out + version poll target (`VITE_WEBSITE_URL`). */
export const websiteUrl = import.meta.env.VITE_WEBSITE_URL;

/** The shared api Worker origin — the announcements read target (`VITE_API_URL`). */
export const apiUrl = import.meta.env.VITE_API_URL;

/** The build id baked in at build (`VITE_BUILD_ID`, else `"dev"`) — the version-check baseline. */
export const buildId = import.meta.env.VITE_BUILD_ID ?? "dev";

/**
 * Instance feature flags. `requireConsent` is OFF by default (mirroring the website's
 * `requireCookieConsent`) — the consent UI is compliant-ready, a client flips this on
 * when the app ships an analytics/ads SDK.
 */
export const features = { requireConsent: false } as const;

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
