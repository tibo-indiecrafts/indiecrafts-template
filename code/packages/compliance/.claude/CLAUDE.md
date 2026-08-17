# @indiecrafts/compliance — legal pages + cookie consent

**Stack:** React 19 · TypeScript · Tailwind v4 · Sanity v5 · next-intl. The site's legal +
data-protection surface: the legal pages, the cookie-consent runtime, and legal re-acceptance.

Auto-loads under `code/packages/compliance/**`. Consumed as source via `transpilePackages`.
Three domains under one Sanity barrel:

- **`src/pages/`** — the 5 **legal pages** (legal notice · privacy · cookies · CGU · CGV): the
  `legalPage` schema, `LegalPageContent({ pageKey, locale })` (fetch + PortableText `LegalBody`),
  and `CookieDeclaration` (the cookie-policy table). App-agnostic — no layout/SEO/flag logic
  inside; the app's thin route shell wraps it (see below).
- **`src/consent/`** — the **cookie-consent** runtime: `consent-store.ts` (framework-free store +
  Google Consent-Mode `dataLayer` push), `useConsent.ts`, `CookieBanner`/`CookiePreferences`,
  `ConsentGate`/`ConsentScript` (gate children / `next/script` on a granted category),
  `ManagePreferencesButton`. Signal types (`ConsentSignal`, `CookieRow`, …) in
  `consent/consent-signals.ts` (client-safe, no Sanity graph).
- **`src/reacceptance/`** — the **legal re-acceptance** banner: `LegalNotice.tsx` + the first-party
  `legal-store.ts` cookie ("policies updated, please Accept" for privacy/terms/CGV).
- **`src/sanity/`** — the **one** `complianceSanity` **`SanityModule`** barrel: `cookieConsent` +
  `cookieCategory`/`cookieEntry` + `legalConsent` + `legalPage` schema, their desk sections
  (`cookieStructureItem` · `legalConsentStructureItem` · `legalStructureItem`), and the `legalPage`
  i18n templates. Activate = one line — add it to `sharedModules` in the `composeStudio([...])` call
  in `sanity.config.ts`. Read paths: `getCookieConsent` (`sanity/cookies.ts`), `getLegalAcceptance`
  (`sanity/legal.ts`), `getConsentPolicyVersion` (`sanity/policy-version.ts`, stamped on opt-ins).

- **Routes stay in the app.** Next.js only scans `app/**`, so the 5 legal routes are ~15-line
  **shells** that wrap `LegalPageContent` in `DefaultLayout`, gate on `features.legal.*`
  (`isPageVisible`), and emit SEO (`generateMetadata` + `PageSchemas`). The package owns the rest.
- **Other host wiring in the app:** the banner + re-acceptance **mounts** in `[locale]/layout.tsx`
  (banner gated on `siteSettings.analytics.requireCookieConsent`), the GA gtag `<head>` script.
- Full reference → [`docs/packages/compliance.md`](../../../../docs/packages/compliance.md).
