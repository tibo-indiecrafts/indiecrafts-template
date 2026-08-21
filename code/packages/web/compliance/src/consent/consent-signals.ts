/**
 * Re-export shim — the pure consent constants + types moved to the portable brick
 * `@indiecrafts/packages-shared-compliance/shared` (so the Expo + Electron shells share
 * them). This file keeps the historical import path
 * (`@indiecrafts/packages-web-compliance/consent/consent-signals`) working for every
 * existing importer (`CookieBanner`, `CookiePreferences`, `CookieDeclaration`, the
 * Sanity read path). New code should import from the shared brick directly.
 */

export {
  CONSENT_SIGNALS,
  type ConsentSignal,
  type ConsentCategory,
  type CookieRow,
  type CookieConsent,
} from "@indiecrafts/packages-shared-compliance/shared";
