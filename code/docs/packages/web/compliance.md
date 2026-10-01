---
title: "Compliance — legal pages + cookie consent"
description: "The @indiecrafts/packages-web-compliance brick (code/packages/web/compliance) owns the site's whole legal + data-protection surface, editor-managed in Sanity."
status: stable
---

# Compliance — legal pages + cookie consent

> **Portable core split out.** The reusable half — the consent decision math, the store
> contract, the legal-route contract, and a copy-injected consent + re-acceptance UI — now
> lives in **[`@indiecrafts/packages-shared-compliance`](/packages/shared/compliance)**,
> so the `app` surface reaches the website's legal pages and ships a
> compliant-ready consent UI. This brick (website only) keeps the Sanity cookie inventory,
> the next-intl banner, the legal-page **content**, and the GDPR flow — it re-exports the
> moved `consent-signals` (unchanged import path) and imports `grantedKeys`/`consentUpdate`/
> `ConsentRecord` from the shared brick (one source of truth for the math).

The **`@indiecrafts/packages-web-compliance`** brick (`code/packages/web/compliance`) owns the site's whole
legal + data-protection surface, editor-managed in Sanity. Four domains, one brick:

- **`src/pages/`** — the five **legal pages** (legal notice, privacy, cookies, CGU, CGV): the
  `legalPage` schema + the `LegalPageContent` renderer + the cookie declaration table.
- **`src/consent/`** — the **cookie-consent** runtime: banner, store, Consent-Mode gates/hooks,
  the `cookieConsent` schema.
- **`src/reacceptance/`** — the **legal re-acceptance** banner for the contract documents.
- **`src/requests/`** — the **data-subject request** flow (GDPR Art. 15–21 + consent withdrawal):
  `submitDataRequest` (validate → store in the api's `data_requests` D1 table → alert), and the
  `dataRequestOwner` email group. The old `dataRequest` Sanity type stays read-only (deprecated). The form UI (`DataRequestForm`) lives in
  `@indiecrafts/packages-web-ui-components`.

Everything is a one-line `composeStudio` contribution (`complianceSanity` in `sharedModules`).
No config flag for consent — content and switches live in Sanity; the data-request **surface**
is gated by `features.legal.dataRequest`. The banner **mount**, the GA `<head>` script, and the
thin **route shells** (legal pages + `/data-request`) stay in the app (routes can't live in a package).

This page documents cookie consent (below) + [Legal pages](#legal-pages) +
[Legal re-acceptance](#legal-re-acceptance-policy-updates) +
[Data-subject requests](#data-subject-requests).

## Cookie consent (CMP in Sanity)

An editor-managed consent platform: consent **categories** (required + optional), a
**preferences dialog** with per-category toggles, a **cookie inventory** on the policy
page, and versioned re-consent.

Two Sanity homes:

- **Master switch + GA id** — `siteSettings.analytics`: `requireCookieConsent` (show the
  banner, hold GA until accept) and `googleAnalyticsId` (see [Analytics](/projects/web/website/seo/analytics)).
- **Content** — the `cookieConsent` singleton (Studio → **Cookies & consentement**), read at
  request time by `getCookieConsent(locale)` in `@indiecrafts/packages-web-compliance/sanity/cookies`. It is the **sole**
  source (no config fallback); any fetch error returns the empty shape, never throws. `pnpm
seed` ships demo content.

## The model

| Field                          | What it is                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------- |
| `version`                      | Bump it (e.g. `1` → `2`) to **re-prompt every visitor** after a material change. |
| `banner.title` / `banner.body` | Banner copy (`localeString`). Button labels stay in `messages.cookies.*`.        |
| `categories[]`                 | The groups a visitor accepts/refuses — each a `cookieCategory`.                  |
| `cookies[]`                    | The declaration table on the cookie-policy page — each a `cookieEntry`.          |

**`cookieCategory`** — `key` (`necessary` / `analytics` / `marketing` / `preferences`),
`title` + `description` (`localeString`), `required` (necessary = always on, locked), and
`consentSignals` — the Google **Consent Mode** keys this category grants when accepted.

**`cookieEntry`** — `name`, `provider`, `categoryKey`, `purpose` (`localeString`),
`duration`, `party` (`first` / `third`).

## Consent Mode mapping

Accepting a category flips its `consentSignals` to `granted`; every signal no granted
category lists stays `denied`. The layout emits `gtag('consent','default', …)` with all
optional signals `denied` + `wait_for_update: 500`, then the store pushes a
`['consent','update', …]` payload to `window.dataLayer` on every choice.

The seven signals live in `CONSENT_SIGNALS` (`@indiecrafts/packages-web-compliance/consent/consent-signals`): `analytics_storage`,
`ad_storage`, `ad_user_data`, `ad_personalization`, `functionality_storage`,
`personalization_storage`, `security_storage`. The template's demo mapping:

| Category    | Signals granted                                    |
| ----------- | -------------------------------------------------- |
| Necessary   | — (always on)                                      |
| Analytics   | `analytics_storage`                                |
| Marketing   | `ad_storage`, `ad_user_data`, `ad_personalization` |
| Preferences | `functionality_storage`, `personalization_storage` |

The mapping is **data-driven** — edit a category's signals in Sanity, no code change.

## GDPR behaviour (built in)

- Optional categories default **off** — no pre-ticked boxes.
- **Reject all / Customize / Accept all** on equal footing.
- **Browser opt-out signals honoured** — on first visit, Global Privacy Control
  (`navigator.globalPrivacyControl`) or legacy Do-Not-Track auto-records reject-all
  (non-essential denied), no banner nag; the visitor can still opt in via preferences.
  Toggle with the banner's `respectGpc` prop (default on). GPC is enforceable under CCPA/CPRA.
- Non-essential tags held until opt-in (`default: denied` + `wait_for_update: 500`).
- Choices persist in `localStorage` (key `cookie-consent`) with the consent `version` + a
  timestamp; changing `version` re-prompts.
- **Policy-linked re-consent** — the effective `version` = `cookieConsent.version` + the
  **cookie-policy** page's `lastUpdated` (composed in `getCookieConsent`). Publish a cookie-policy
  update → every visitor is re-prompted, no manual version bump.
- **Opt-in proof of consent** — newsletter/waitlist submissions are stamped with the
  **privacy-policy version** the person accepted + the timestamp (`consentPolicyVersion` on the
  `subscriber` / `waitlistEntry` doc). The version is derived **server-side** by the app route
  (`getConsentPolicyVersion()`, `@indiecrafts/packages-web-compliance/sanity/policy-version`) and passed to the module engine — never
  from the request. Defensible proof for email marketing (GDPR Art. 7).

_Out of scope:_ IAB TCF (needs a certified CMP), server-side consent **logging** (a DB history of
every change — a marketing site has no accounts; add a D1-backed log only if a client needs it),
automatic cookie-scanning — the inventory is editor-maintained.

## Legal pages

Five editor-written pages, one `legalPage` document per (page, locale):

| Page           | `pageKey`          | Route             | Legal basis                           |
| -------------- | ------------------ | ----------------- | ------------------------------------- |
| Legal notice   | `mentions-legales` | `/legal-notice`   | publisher identity (LCEN)             |
| Privacy policy | `confidentialite`  | `/privacy-policy` | data processing (GDPR)                |
| Cookie policy  | `cookies`          | `/cookie-policy`  | cookie inventory + consent (ePrivacy) |
| Terms of use   | `cgu`              | `/terms`          | contract law                          |
| Terms of sale  | `cgv`              | `/terms-of-sale`  | commercial law                        |

**Schema** — `legalPage` (Studio → **Pages légales**, grouped by language): `pageKey` (radio,
fixed after creation), `title` (the H1), `lastUpdated` (the date shown + the re-consent key),
and a PortableText `body` (headings, lists, marks, links — no page-builder blocks, so legal
pages stay decoupled from the blog). SEO comes from the doc's own `seo` field (the **SEO &
visibilité** section, the shared `seoMeta`), per locale.

**Rendering** — `LegalPageContent({ pageKey, locale })`
(`@indiecrafts/packages-web-compliance/pages/LegalPageContent`) fetches the doc via `legalPageQuery` and
renders the title + date + body; the cookie page also appends the live cookie-declaration
table. It is **app-agnostic** — no layout, no SEO, no feature-flag logic inside.

**How the routes work (package content, app route).** Next.js only scans `app/**` for routes,
so a page file can never live in a package. Each of the five routes stays in the app as a
~15-line **shell** that wraps the package content:

```tsx
// app/[locale]/cookie-policy/page.tsx
export async function generateMetadata({ params }) {
  // SEO — app (siteMeta)
  const { locale } = await params;
  return buildMetadata({ page: pages.cookies, locale });
}
export default async function CookiePolicyPage({ params }) {
  const { locale } = await params;
  if (!isPageVisible(pages.cookies)) notFound(); // feature-flag gate — app
  return (
    <DefaultLayout>
      {" "}
      {/* app shell */}
      <PageSchemas page={pages.cookies} locale={locale} /> {/* JSON-LD — app */}
      <LegalPageContent pageKey="cookies" locale={locale} />{" "}
      {/* body — package */}
    </DefaultLayout>
  );
}
```

The app keeps the route shell, the `pages` map entry (drives the typed route), the
`features.legal.*` flag, `DefaultLayout`, and the page SEO. The package owns everything else.

**Proof-of-consent version** — opt-in forms (newsletter, waitlist, comments) stamp the
**privacy-policy** `lastUpdated` on the stored record as GDPR proof. The date is read
server-side by `getConsentPolicyVersion()` (`@indiecrafts/packages-web-compliance/sanity/policy-version`,
via `consentPolicyVersionQuery`) in the API routes — never from the request.

## Legal re-acceptance (policy updates)

A sibling of cookie consent, for the **contract** documents — Privacy, Terms (CGU), Terms of sale
(CGV). The cookie policy keeps its own granular banner; the legal notice (imprint) is informational
and excluded. When any tracked page's **Dernière mise à jour** date changes, a non-blocking bottom
banner (`LegalNotice`, `@indiecrafts/packages-web-compliance/reacceptance/LegalNotice`) tells the returning visitor and offers
**Review** + **Accept**.

- **Copy** — the `legalConsent` singleton (Studio → **Mise à jour des documents légaux**):
  `banner.message` / `acceptLabel` (`localeString`) — the Privacy · Terms links are added automatically + an optional manual `version`.
  Sole source, no `messages` fallback. Read by `getLegalAcceptance(locale)`
  (`@indiecrafts/packages-web-compliance/sanity/legal`).
- **Version** — the effective version is the optional manual `version` (usually blank) joined with the
  `lastUpdated` of the **flag-enabled** tracked pages — privacy + terms + terms-of-sale, each gated on
  its `features.legal.*` flag (a disabled page like CGV, off by default, is skipped so it can't trigger a
  re-accept for a 404). Bumping any enabled date re-shows the banner — the same recipe as cookie
  re-consent. The **Review** link targets the first flag-enabled tracked page (app-computed).
- **Deposit** — a first-party cookie `<site.prefix>.legal-ack` (`@indiecrafts/packages-web-compliance/reacceptance/legal-store`),
  `SameSite=Lax`, `Secure` on https, 1-year. **Server-read** in the layout so the banner is decided
  server-side — no flash; the client writes it on Accept. Unlike cookie consent (localStorage), this
  is a cookie precisely so the server can gate it.
- **Declared** — the `legal-ack` cookie is a strictly-necessary row in the cookie declaration
  (`cookieConsent.cookies[]`), so it appears on the cookie-policy page like every other cookie. **Any
  new client storage the app sets must be declared here** (ePrivacy).
- **Mount** — `[locale]/layout.tsx`, next to `CookieBanner`; shown only when copy + version are set and
  the deposited version is stale. Waits its turn behind the cookie banner (`useOverlayTurn`) — one overlay at a time.

## Loading scripts / cookies by consent

Beyond GA (which loads always and gates via Consent Mode), gate **any** cookie-setting
script or embed on a category. Three tools:

**`useConsent()`** (`@indiecrafts/packages-web-compliance/consent/useConsent`) — reactive read of the visitor's choices via
`useSyncExternalStore`. Returns `{ choices, has, decided, openPreferences }`:

```tsx
const { has, decided, openPreferences } = useConsent();
if (has("marketing")) {
  /* …load a pixel… */
}
```

**`<ConsentGate category="…">`** (`@indiecrafts/packages-web-compliance/consent/ConsentGate`) — render
children only while that category is granted (mounts on accept, unmounts on withdrawal).
The canonical slot for a pixel/embed/widget:

```tsx
// Meta Pixel — loads only after the visitor accepts "marketing"
<ConsentGate category="marketing">
  <MetaPixel id="123456" />
</ConsentGate>
```

**`<ConsentScript category src …>`** (`@indiecrafts/packages-web-compliance/consent/ConsentScript`) — a
`next/script` gated on consent, for third-party tags without Consent-Mode support (Meta
Pixel, Hotjar, LinkedIn Insight, …):

```tsx
// A support chat that sets cookies — gated on "preferences"
<ConsentScript
  category="preferences"
  src="https://widget.example.com/chat.js"
  strategy="afterInteractive"
/>
```

Place these wherever the tag belongs (a layout, a page, a section). Necessary-category
scripts need no gate. Google Analytics stays as-is: loaded always, storage gated by the
Consent-Mode signal update, **not** by `ConsentGate`.

## Re-open the dialog

Any "Cookie settings" control opens the preferences dialog — `openPreferences()` from
`useConsent()` (it fires the `cookie-preferences-open` window event) or the
`?cookies=manage` URL. The cookie-policy page includes a **Manage preferences** button, and
`/account` carries a **Cookie preferences** card that opens the same dialog.

## Confirmation toast

Every **explicit** consent or legal choice — `CookieBanner`'s accept/reject, `CookiePreferences`'
save, and `LegalNotice`'s accept — fires a "choice saved" toast
(`showConsentSavedToast`, `@indiecrafts/packages-web-ui-components/web/consent-toast`) with a
**Manage** action that reopens the preferences dialog. The silent geo auto-seed
(`applyConsent(..., "auto")`) never toasts — only a choice the visitor actually made does.

## Data-subject requests

The `/data-request` page lets a visitor **exercise a GDPR right** without an account: it is a
routed request, not a self-service export (the template stores no user database). The visitor
picks one of seven rights — access, rectification, erasure, restriction, portability, objection,
withdraw consent — gives an email + an optional message, and submits.

The flow mirrors the newsletter form:

1. **`DataRequestForm`** (`@indiecrafts/packages-web-ui-components/web/form/DataRequestForm`) — the client
   form. All copy is passed in from `messages.legal.dataRequest.*`; a honeypot + Turnstile block
   bots. POSTs `/api/data-request`.
2. **The route** (`src/app/api/data-request/route.ts`) — `withGuard` (origin, rate limit, body
   cap, Turnstile) → `submitDataRequest`. Gated by `features.legal.dataRequest` (404 when off).
3. **`submitDataRequest`** (`@indiecrafts/packages-web-compliance/requests/submit`) — validates, then
   **stores the request** via the shared api (`POST /v1/data-request` → the `data_requests` table in
   the main D1; the source of truth; never deduped), then sends a best-effort alert to the
   controller. A mail failure never fails a stored request. `API_URL` / `APP_API_TOKEN` unset → the
   route answers 500 and logs `data request write skipped`.

The seven rights are the one `DATA_REQUEST_TYPES` set
(`@indiecrafts/packages-web-compliance/requests/request-types`) — read by the form options, the validator, and
the api's allowed set (mirrored in `code/shared/api/src/data-request/route.ts`), so they never drift.

**No account needed.** Any visitor can exercise a right, so a request is stored whatever the
email — nothing is matched against users; the address only has to be well-formed (Turnstile, the
honeypot and the rate limit stop bots). If the mailbox does not exist, Resend accepts the receipt
and it bounces (visible in the Resend dashboard, not in the admin); the operator can still close
the request — **Reject** with "Email the requester" unticked.

**Receipt.** Once a request is stored, the api emails the requester a receipt in the request's
language: the right, the reference `#id`, and the due date (one calendar month). Copy: Studio →
E-mails → **RGPD — accusé de réception** (`dataRequestReceipt`); blank fields use the built-in
en/fr text, and unticking it turns the receipt off.

**Admin.** Requests land in the admin **Data requests** screen (`/data-requests`, newest first,
last 100): date (UTC), the right, the due date (an **Overdue** badge on an open request past it),
the email (a `mailto:` link), the status, the message, locale + source. The right opens a **side
sheet** (`?id=<n>`) with the requester's message first (highlighted), the full request, its history, and the moves its status allows: **Start**
(new → in progress), **Mark done**, **Reject**. Done / Reject open a reply **prefilled in the
requester's language** (`admin.dataRequests.replies.*`); with "Email the requester" ticked, the api
emails it (Studio → **RGPD — demande clôturée**, `dataRequestClosed`). A closed request stays
closed. Each move is audited (`admin.data_request_status`). Act within **one month** (the legal
window). The alert recipient (DPO / controller inbox) is set on the **E-mails** singleton →
**RGPD — nouvelle demande** (`dataRequestOwner`); leave it off and the request is still recorded,
just not emailed. `RESEND_API_KEY` powers the send. The alert links
`${ADMIN_URL}/data-requests?id=<n>` (that request's sheet) when the website's `ADMIN_URL` is set;
without it, the alert names the screen.

The privacy policy's "Your rights" section links `/data-request`; the page appears in the footer
**Legal** column. `pnpm seed` ships demo SEO + the footer link + the linked prose.
