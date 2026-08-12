/**
 * Pure, client-safe cookie-consent constants + types — no server imports, so both
 * the server read path (`./cookies.ts`) and client code (`consent-store.ts`,
 * `<ConsentGate>`) can import them without pulling the Sanity client into a bundle.
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
