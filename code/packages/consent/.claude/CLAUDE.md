# @indiecrafts/consent — cookie consent

**Stack:** React 19 · TypeScript · Tailwind v4 · Sanity v5 · next-intl. Cross-cutting cookie-consent infrastructure (banner · store · Consent-Mode signals · editable policy).

Auto-loads under `code/packages/consent/**`. Consumed as source via `transpilePackages`.

- **Runtime (client):** `consent-store.ts` (framework-free store + Google Consent-Mode `dataLayer` push), `useConsent.ts`, `CookieBanner`/`CookiePreferences` (banner + per-category dialog), `ConsentGate`/`ConsentScript` (gate children / `next/script` on a granted category), `ManagePreferencesButton`.
- **Sanity:** the `cookieConsent` singleton + `cookieCategory`/`cookieEntry` objects + `cookieStructureItem` desk, exported as the `consentSanity` **`SanityModule`** barrel (`src/sanity/index.ts`). Activate = one line in `composeSanity([...])`. `getCookieConsent(locale)` (`src/sanity/cookies.ts`) is the React-`cache`d read path.
- **Signal types** (`ConsentSignal`, `CookieRow`, …) live in this package — `src/consent-signals.ts`, imported by app + legal page as `@indiecrafts/consent/consent-signals` (client-safe, no Sanity graph). Copy falls back to `messages.cookies.*` when Sanity is empty.
- **Host wiring stays in the app:** the banner **mount** in `[locale]/layout.tsx` (gated on `siteSettings.analytics.requireCookieConsent`), the GA gtag `<head>` script, and the cookie-policy page.
