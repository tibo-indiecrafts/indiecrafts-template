# `@indiecrafts/packages-web-compliance` — legal pages + cookie consent

**Stack:** React 19 · TypeScript · Tailwind v4 · Sanity v6 · next-intl. The site's legal +
data-protection surface: the legal pages, the cookie-consent runtime, and legal re-acceptance.

Auto-loads under `code/packages/web/compliance/**`. Consumed as source via `transpilePackages`.
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
- **`src/requests/`** — the **data-subject request** flow (GDPR Art. 15–21 form): `submitDataRequest`
  (validate → store via the api's `/v1/data-request` (D1) → alert linking `${ADMIN_URL}/data-requests`),
  `validate.ts`, `request-types.ts` (the 7 rights). The form UI (`DataRequestForm`) is in
  `@indiecrafts/packages-web-ui-components`; operators read requests in the admin "Data requests" screen.
- **`src/emails/`** — the compliance email templates (`data-request-notification`), rendering via
  `@indiecrafts/packages-web-email`'s `renderEmailLayout`. This brick owns its email end-to-end (group in
  `src/sanity/email.ts`, template here, send in `src/requests/submit.ts`).
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
- Full reference → [`code/docs/packages/web/compliance.md`](../../../../docs/packages/web/compliance.md).
