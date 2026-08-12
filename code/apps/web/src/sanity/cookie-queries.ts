import { defineQuery } from "next-sanity";

/**
 * Cookie-consent GROQ — the `cookieConsent` singleton (banner copy, consent
 * categories + their Consent-Mode signals, and the cookie inventory). Labels are
 * `localeString` objects resolved per-request in `getCookieConsent`
 * (`src/lib/cookies.ts`). `defineQuery` flags it for `sanity typegen`.
 */
export const cookieConsentQuery = defineQuery(`
  *[_id == "cookieConsent"][0]{
    version,
    banner{ title, body },
    categories[]{ key, title, description, required, consentSignals },
    cookies[]{ name, provider, categoryKey, purpose, duration, party }
  }
`);
