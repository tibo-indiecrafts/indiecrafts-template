/**
 * `@/config` — this mobile app's config home. Re-exports the PORTABLE config
 * core from `@indiecrafts/packages-shared-config/mobile` (i18n · format · types — React-free, no
 * web/DOM coupling). Add mobile-owned **instance** config here — screens, deep
 * links, native env — as the app grows.
 *
 * Rule: mobile app code imports from `@/config`; it never pulls the web slice
 * (`@indiecrafts/packages-shared-config` root barrel). See `code/docs/shared/architecture/multi-app.md`.
 */
import type { ConsentConfig } from "@indiecrafts/packages-shared-compliance/shared";
import { safeWebOrigin } from "./safe-web-origin";

export * from "@indiecrafts/packages-shared-config/mobile";

/**
 * Per-deployment namespace for browser-owned keys (consent record, legal acceptance,
 * locale choice) — mirrors the web `site.prefix`. `site` is web-only, so the mobile app
 * owns its prefix here (`EXPO_PUBLIC_SITE_PREFIX`, else the template default).
 */
export const sitePrefix = process.env.EXPO_PUBLIC_SITE_PREFIX ?? "indiecrafts";

/**
 * Every persisted key, namespaced once under `sitePrefix` — the ONE home for
 * storage-key strings. Screens and stores read a name here; they never build
 * `${sitePrefix}.foo` inline (that drift is how two files disagree on a key).
 * Consumed by `lib/storage` (locale) + the compliance stores (consent · legal,
 * which pass the key into the brick's `createNativeStore`).
 */
export const STORAGE_KEYS = {
  locale: `${sitePrefix}.locale`,
  themePreference: `${sitePrefix}.theme-preference`,
  cookieConsent: `${sitePrefix}.cookie-consent`,
  legalAck: `${sitePrefix}.legal-ack`,
  announcementAck: `${sitePrefix}.announcement-ack`,
  announcementToastAck: `${sitePrefix}.announcement-toast-ack`,
  // Cached visitor country (from the api `/v1/geo`) for the consent geo decision.
  geoCountry: `${sitePrefix}.geo-country`,
  // Per-device snooze for the one-time marketing-email sign-in nudge (× dismiss).
  marketingNudgeSnooze: `${sitePrefix}.mkt-nudge-snooze`,
} as const;

/** The marketing-site origin — the legal link-out + version poll target (HTTPS-only; see `safeWebOrigin`). */
export const websiteUrl = safeWebOrigin(process.env.EXPO_PUBLIC_WEBSITE_URL);

/**
 * Canonical web account entry point the app hands off to (Manage account / delete).
 * Default: the website's `/account`; override with `EXPO_PUBLIC_ACCOUNT_URL` (e.g. the
 * `app.<domain>/account` product surface). HTTPS-only (see `safeWebOrigin`): a non-TLS
 * origin resolves to `undefined`, so the hand-off button does not render.
 */
export const accountUrl = safeWebOrigin(
  process.env.EXPO_PUBLIC_ACCOUNT_URL ??
    (websiteUrl ? `${websiteUrl}/account` : undefined),
);

/** The build id baked in at build (`EXPO_PUBLIC_BUILD_ID`, else `"dev"`). */
export const buildId = process.env.EXPO_PUBLIC_BUILD_ID ?? "dev";

/**
 * Instance feature flags. `requireConsent` is OFF by default (mirroring the website) —
 * the consent UI is compliant-ready, a client flips this on when the app ships an
 * analytics/ads SDK. `exportAccount` gates the self-service data-export control in the
 * signed-in view (account deletion is an unconditional web hand-off, no flag).
 */
export const features = {
  requireConsent: false,
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
 * & accept the updated legal documents (and re-asks for consent).
 */
export const policyVersion = "2026-01";
