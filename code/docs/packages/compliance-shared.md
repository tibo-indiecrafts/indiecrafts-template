# `@indiecrafts/packages-shared-compliance` — the portable compliance core

The half of the compliance surface every shell can share: the consent decision math, the
store contract, the legal-route contract, and a forked consent + legal-re-acceptance UI.
Lives in **`code/packages/shared/compliance`**, consumed as source. **No `next`/Sanity**
— the website keeps its richer Sanity/next-intl banner
([`@indiecrafts/packages-web-compliance`](./compliance)) over the same math; this brick
serves the `app` web surface and the Expo shell.

Extracted so the shells reach the website's canonical legal pages + ship a compliant-ready
consent UI out of the box, instead of re-implementing three bespoke banners.

## Exports — forked by platform (like `system-pages`)

`./shared` = the platform-agnostic core (no React/DOM). `./web` = the DOM (shadcn)
components + a `localStorage` store adapter (**Next-free** — serves the plain-React `app`
surface). `./native` = the React Native components + an
`AsyncStorage` store adapter.

| Import                                           | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`./shared`**                                   | **Consent math** — `grantedKeys` / `consentUpdate` (the seven Consent-Mode signals), the `ConsentRecord` shape, the generic `Store<T>` / `ConsentStore` contract, the default taxonomy (`DEFAULT_CONSENT_CATEGORIES` + `resolveCategories` / `acceptAllChoices` / `rejectAllChoices`), and the signal types. **Legal contract** — `LEGAL_PAGES` (the 5 legal pages + the data-request form, per-locale slugs), `LEGAL_PAGE_KEYS`, `legalUrl(baseUrl, key, locale)`, `LegalAcceptanceRecord` + `needsReacceptance(acked, current)`. **Account copy** — `buildDeleteAccountCopy(t)` / `buildExportCopy(t)`, pure builders that assemble a `DeleteAccountCopy` / `ExportCopy` object from a namespace-scoped translator (`t` already scoped to `account.delete` / `account.export`), so one shape serves next-intl and react-intl alike. Re-exported from `./web` and `./native` too. |
| `ConsentBanner` (`./web`, `./native`)            | The cookie-consent banner — Accept all · Reject · Customize (expands the per-category toggles). Copy + `categories` are **injected** (no i18n/Sanity inside). Mount at the shell root only when consent is needed (the shell reads its `Store` + a `requireConsent` flag).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `ConsentPreferences` (`./web`, `./native`)       | The per-category toggle list — presentational + controlled; the parent owns the `choices` state + Save. Required categories are an always-on, disabled switch.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `AccountConsentTab` / `AccountDataTab` (`./web`) | The two **unified account modal** custom tabs (Clerk-free). `AccountConsentTab` re-opens cookie-consent choices over `ConsentPreferences` and writes the SAME `createWebStore` record the banner reads. `AccountDataTab` composes `ExportSection` + `DeleteAccountSection` for data export + account deletion. Copy + `categories` are injected; Clerk access comes via an injected `AccountAuth` (`{ getToken, submitErasure, onDeleted }`), built per surface from its SDK (`@clerk/nextjs` website/app).                                                                                                                                                                                                                                                                                                                                                                        |
| `LegalReacceptancePrompt` (`./web`, `./native`)  | The **"our legal documents changed — review & accept"** popup. Mount when `needsReacceptance(store.get(), currentVersion)`. `onReview` opens the legal pages (the shell's link-out); `onAccept` persists a `LegalAcceptanceRecord`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `createWebStore<T>(key)` (`./web`)               | `localStorage`-backed `Store<T>` — synchronous, stable-ref `get()` for `useSyncExternalStore`. Serves the consent record + the legal-acceptance record (each under its own `${site.prefix}.*` key).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `createNativeStore<T>(key)` (`./native`)         | `AsyncStorage`-backed `Store<T>` — an in-memory mirror hydrated once at creation (the `get()` contract is synchronous, AsyncStorage is not).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Confirmation toast + a settings control (surface-owned)

`ConsentBanner`/`ConsentPreferences` stay copy-in, no-toast — each shell fires the confirmation
itself after persisting an **explicit** choice (accept/reject/save) or a legal re-acceptance, via
`showConsentSavedToast` (`@indiecrafts/packages-web-ui-components/web/consent-toast`). The silent
geo auto-seed effect never calls it. Each shell's toast `onManage` opens its own
cookie-preferences control, built from this brick's `ConsentPreferences` over the same
`Store` key the banner reads: the `app` web surface at `/account`.

## The split (this brick vs the web brick vs the app)

- **`packages-shared-compliance`** owns the portable math + the copy-injected forked UI + the store adapters.
- **[`packages-web-compliance`](./compliance)** (website only) keeps the Sanity-driven cookie inventory, the next-intl `CookieBanner`, the legal-page **content** (`LegalPageContent`), the GDPR data-request flow, and the Sanity schema. It re-exports the moved `consent-signals` (unchanged import path) and imports `grantedKeys`/`consentUpdate`/`ConsentRecord` from here (one source of truth for the math).
- **Each shell** injects copy from its `messages`, wires a store adapter, gates the banner on a `requireConsent` flag, and passes a `site.websiteUrl` base to `legalUrl` for the link-out. See [Cross-platform shell](/shared/architecture/cross-platform-shell).

## Gotchas

- **No native GPC.** Global Privacy Control is a browser signal — `navigator.globalPrivacyControl`
  (`browserSignalsDeny`, `./web`) or the `Sec-GPC: 1` request header (read server-side by each
  shell's `[locale]/layout.tsx`, unioned via `signalsDeny`) — and neither exists on React Native
  (no `navigator`, no browser HTTP request). This is by design, not a gap: `./native` ships no
  signals file at all. A native visitor still opts out through the same consent/preferences UI
  (`ConsentBanner`/`ConsentPreferences` from `./native`) — there's just no GPC trigger for it.
- **`legalUrl` mirrors the website's `as-needed` prefix policy** (default locale unprefixed, others `/<code>`) via `localizedPathname`, so the URL matches the live route. It falls back to the default-locale slug for a locale with no legal slug yet.
- **`LEGAL_PAGES` is `as const`** so its literal `key`/`id`/`slug` survive being spread into the website's `pages` map (which derives its typed route union from the literal `key`s). The website's `pages.ts` spreads `...LEGAL_PAGES.<key>` + adds `enabled`.
- **The native store flashes for ~ms on a returning visitor** (the in-memory mirror starts empty until AsyncStorage resolves). Fine — the consent banner is off by default (`requireConsent`), and a sub-second flash beats blocking launch on storage.
- **`@react-native-async-storage/async-storage` is an optional peer** — only the `./native` store imports it, only the mobile app bundles that fork.

## Wiring & conventions

Consumed as source via `transpilePackages` (web surfaces) / Metro (Expo). The ≥2-consumer
rule + the "adding a brick" shape → **[Packages overview](./)**.

- [`code/packages/shared/compliance/`](../../code/packages/shared/compliance/) — the source
- [`code/packages/_registry.md`](../../code/packages/_registry.md) — roster + rule
