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

/**
 * The cookie-policy page's last-updated date. Folded into the effective consent
 * version (`getCookieConsent`) so publishing a policy change re-prompts every
 * visitor — the anonymous-visitor equivalent of a terms re-acceptance. Returns
 * `null` when no `legalPage` with `pageKey == "cookies"` exists (graceful: the
 * version then falls back to the manual `cookieConsent.version` alone).
 */
export const cookiePolicyVersionQuery = defineQuery(`
  *[_type == "legalPage" && pageKey == "cookies"] | order(lastUpdated desc)[0].lastUpdated
`);

/**
 * Legal re-acceptance signal — the `legalConsent` copy singleton plus the
 * last-updated date of each CONTRACT document (privacy, terms, terms of sale).
 * The dates fold into the effective version in `getLegalAcceptance` (`./legal`)
 * so publishing any of them re-shows the "we updated our policies" banner —
 * the terms-acceptance analogue of the cookie re-consent above. Cookies keep
 * their own banner; the legal notice (imprint) is informational and excluded.
 */
export const legalAcceptanceQuery = defineQuery(`{
  "copy": *[_id == "legalConsent"][0]{ version, banner{ message, reviewLabel, acceptLabel } },
  "privacy": *[_type == "legalPage" && pageKey == "confidentialite"] | order(lastUpdated desc)[0].lastUpdated,
  "terms": *[_type == "legalPage" && pageKey == "cgu"] | order(lastUpdated desc)[0].lastUpdated,
  "sales": *[_type == "legalPage" && pageKey == "cgv"] | order(lastUpdated desc)[0].lastUpdated
}`);
