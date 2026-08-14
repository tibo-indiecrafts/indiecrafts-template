# Cookie consent (CMP in Sanity)

An editor-managed consent platform: consent **categories** (required + optional), a
**preferences dialog** with per-category toggles, a **cookie inventory** on the policy
page, and versioned re-consent. No config flag — content and switch both live in Sanity.

Lives in the **`@indiecrafts/consent`** brick (`code/packages/consent`): the banner + store +
Consent-Mode gates + the `cookieConsent` schema + desk — a one-line `composeSanity` contribution.
The banner mount + the GA `<head>` script stay in the app.

The same brick also hosts **legal re-acceptance** — a "policies updated, please Accept" banner for the
privacy/terms documents (see [Legal re-acceptance](#legal-re-acceptance-policy-updates) below).

Two Sanity homes:

- **Master switch + GA id** — `siteSettings.analytics`: `requireCookieConsent` (show the
  banner, hold GA until accept) and `googleAnalyticsId` (see [Analytics](../seo/analytics.md)).
- **Content** — the `cookieConsent` singleton (Studio → **Cookies & consentement**), read at
  request time by `getCookieConsent(locale)` in `@indiecrafts/consent/sanity/cookies`. It is the **sole**
  source (no config fallback); any fetch error returns the empty shape, never throws. `pnpm
  seed` ships demo content.

## The model

| Field | What it is |
| --- | --- |
| `version` | Bump it (e.g. `1` → `2`) to **re-prompt every visitor** after a material change. |
| `banner.title` / `banner.body` | Banner copy (`localeString`). Button labels stay in `messages.cookies.*`. |
| `categories[]` | The groups a visitor accepts/refuses — each a `cookieCategory`. |
| `cookies[]` | The declaration table on the cookie-policy page — each a `cookieEntry`. |

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

The seven signals live in `CONSENT_SIGNALS` (`@indiecrafts/consent/consent-signals`): `analytics_storage`,
`ad_storage`, `ad_user_data`, `ad_personalization`, `functionality_storage`,
`personalization_storage`, `security_storage`. The template's demo mapping:

| Category | Signals granted |
| --- | --- |
| Necessary | — (always on) |
| Analytics | `analytics_storage` |
| Marketing | `ad_storage`, `ad_user_data`, `ad_personalization` |
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
  (`getConsentPolicyVersion()`, `@/lib/consent-policy`) and passed to the module engine — never
  from the request. Defensible proof for email marketing (GDPR Art. 7).

_Out of scope:_ IAB TCF (needs a certified CMP), server-side consent **logging** (a DB history of
every change — a marketing site has no accounts; add a D1-backed log only if a client needs it),
automatic cookie-scanning — the inventory is editor-maintained.

## Legal re-acceptance (policy updates)

A sibling of cookie consent, for the **contract** documents — Privacy, Terms (CGU), Terms of sale
(CGV). The cookie policy keeps its own granular banner; the legal notice (imprint) is informational
and excluded. When any tracked page's **Dernière mise à jour** date changes, a non-blocking bottom
banner (`LegalNotice`, `@indiecrafts/consent/LegalNotice`) tells the returning visitor and offers
**Review** + **Accept**.

- **Copy** — the `legalConsent` singleton (Studio → **Mise à jour des documents légaux**):
  `banner.message` / `reviewLabel` / `acceptLabel` (`localeString`) + an optional manual `version`.
  Sole source, no `messages` fallback. Read by `getLegalAcceptance(locale)`
  (`@indiecrafts/consent/sanity/legal`).
- **Version** — the effective version is the optional manual `version` (usually blank) joined with the
  `lastUpdated` of the **flag-enabled** tracked pages — privacy + terms + terms-of-sale, each gated on
  its `features.legal.*` flag (a disabled page like CGV, off by default, is skipped so it can't trigger a
  re-accept for a 404). Bumping any enabled date re-shows the banner — the same recipe as cookie
  re-consent. The **Review** link targets the first flag-enabled tracked page (app-computed).
- **Deposit** — a first-party cookie `<site.prefix>.legal-ack` (`@indiecrafts/consent/legal-store`),
  `SameSite=Lax`, `Secure` on https, 1-year. **Server-read** in the layout so the banner is decided
  server-side — no flash; the client writes it on Accept. Unlike cookie consent (localStorage), this
  is a cookie precisely so the server can gate it.
- **Declared** — the `legal-ack` cookie is a strictly-necessary row in the cookie declaration
  (`cookieConsent.cookies[]`), so it appears on the cookie-policy page like every other cookie. **Any
  new client storage the app sets must be declared here** (ePrivacy).
- **Mount** — `[locale]/layout.tsx`, next to `CookieBanner`; shown only when copy + version are set and
  the deposited version is stale. Stacks above the cookie banner while consent is undecided.

## Loading scripts / cookies by consent

Beyond GA (which loads always and gates via Consent Mode), gate **any** cookie-setting
script or embed on a category. Three tools:

**`useConsent()`** (`@/hooks/useConsent`) — reactive read of the visitor's choices via
`useSyncExternalStore`. Returns `{ choices, has, decided, openPreferences }`:

```tsx
const { has, decided, openPreferences } = useConsent();
if (has("marketing")) {
  /* …load a pixel… */
}
```

**`<ConsentGate category="…">`** (`@indiecrafts/consent/ConsentGate`) — render
children only while that category is granted (mounts on accept, unmounts on withdrawal).
The canonical slot for a pixel/embed/widget:

```tsx
// Meta Pixel — loads only after the visitor accepts "marketing"
<ConsentGate category="marketing">
  <MetaPixel id="123456" />
</ConsentGate>
```

**`<ConsentScript category src …>`** (`@indiecrafts/consent/ConsentScript`) — a
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
`?cookies=manage` URL. The cookie-policy page includes a **Manage preferences** button.
