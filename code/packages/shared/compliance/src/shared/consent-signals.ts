/**
 * Pure, platform-agnostic cookie-consent constants + types — no server/Sanity/DOM
 * imports, so every platform (web store + banner, the Electron renderer, the Expo
 * shell) and the web read path (`getCookieConsent`) can import them without pulling
 * a heavier graph. The web brick re-exports this file so its importers are unchanged.
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
