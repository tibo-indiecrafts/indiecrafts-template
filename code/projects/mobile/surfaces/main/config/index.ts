/**
 * `@/config` — this mobile app's config home. Re-exports the PORTABLE config
 * core from `@indiecrafts/packages-shared-config/mobile` (i18n · format · types — React-free, no
 * web/DOM coupling). Add mobile-owned **instance** config here — screens, deep
 * links, native env — as the app grows.
 *
 * Rule: mobile app code imports from `@/config`; it never pulls the web slice
 * (`@indiecrafts/packages-shared-config` root barrel). See `code/docs/shared/architecture/multi-app.md`.
 */
export * from "@indiecrafts/packages-shared-config/mobile";

/**
 * Per-deployment namespace for browser-owned keys (consent record, legal acceptance,
 * locale choice) — mirrors the web `site.prefix`. `site` is web-only, so the mobile app
 * owns its prefix here (`EXPO_PUBLIC_SITE_PREFIX`, else the template default).
 */
export const sitePrefix =
  process.env.EXPO_PUBLIC_SITE_PREFIX ?? "indiecrafts";

/**
 * Every persisted key, namespaced once under `sitePrefix` — the ONE home for
 * storage-key strings. Screens and stores read a name here; they never build
 * `${sitePrefix}.foo` inline (that drift is how two files disagree on a key).
 * Consumed by `lib/storage` (locale) + the compliance stores (consent · legal,
 * which pass the key into the brick's `createNativeStore`).
 */
export const STORAGE_KEYS = {
  locale: `${sitePrefix}.locale`,
  cookieConsent: `${sitePrefix}.cookie-consent`,
  legalAck: `${sitePrefix}.legal-ack`,
  announcementAck: `${sitePrefix}.announcement-ack`,
  announcementToastAck: `${sitePrefix}.announcement-toast-ack`,
} as const;

/** The marketing-site origin — the legal link-out + version poll target. */
export const websiteUrl = process.env.EXPO_PUBLIC_WEBSITE_URL;

/** The build id baked in at build (`EXPO_PUBLIC_BUILD_ID`, else `"dev"`). */
export const buildId = process.env.EXPO_PUBLIC_BUILD_ID ?? "dev";

/**
 * Instance feature flags. `requireConsent` is OFF by default (mirroring the website) —
 * the consent UI is compliant-ready, a client flips this on when the app ships an
 * analytics/ads SDK.
 */
export const features = { requireConsent: false } as const;

/**
 * The current compliance-document version. Bumping it re-prompts the visitor to review
 * & accept the updated legal documents (and re-asks for consent).
 */
export const policyVersion = "2026-01";
