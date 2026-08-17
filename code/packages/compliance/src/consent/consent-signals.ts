/**
 * Pure, client-safe cookie-consent constants + types — no server/Sanity imports,
 * so both the server read path (`./sanity`/`getCookieConsent`) and client code
 * (`consent-store`, `<ConsentGate>`) + the legal pages can import them via
 * `@indiecrafts/compliance/consent/consent-signals` without pulling a heavier graph.
 */

/** Every Google Consent Mode signal a category can grant. */
export const CONSENT_SIGNALS = [
  "analytics_storage",
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "functionality_storage",
  "personalization_storage",
  "security_storage",
] as const;
export type ConsentSignal = (typeof CONSENT_SIGNALS)[number];

export type ConsentCategory = {
  key: string;
  title: string;
  description?: string;
  required: boolean;
  signals: ConsentSignal[];
};

export type CookieRow = {
  name: string;
  provider?: string;
  category: string;
  purpose?: string;
  duration?: string;
  party?: "first" | "third";
};

export type CookieConsent = {
  version: string;
  banner: { title?: string; body?: string };
  categories: ConsentCategory[];
  cookies: CookieRow[];
};
