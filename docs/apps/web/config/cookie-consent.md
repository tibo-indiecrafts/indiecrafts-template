# Cookie consent (CMP in Sanity)

An editor-managed consent platform: consent **categories** (required + optional), a
**preferences dialog** with per-category toggles, a **cookie inventory** on the policy
page, and versioned re-consent. No config flag — content and switch both live in Sanity.

Two Sanity homes:

- **Master switch + GA id** — `siteSettings.analytics`: `requireCookieConsent` (show the
  banner, hold GA until accept) and `googleAnalyticsId` (see [Analytics](../seo/analytics.md)).
- **Content** — the `cookieConsent` singleton (Studio → **Cookies & consentement**), read at
  request time by `getCookieConsent(locale)` in `src/lib/cookies.ts`. It is the **sole**
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

The seven signals live in `CONSENT_SIGNALS` (`@indiecrafts/utils`): `analytics_storage`,
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
- Non-essential tags held until opt-in (`default: denied` + `wait_for_update: 500`).
- Choices persist in `localStorage` (key `cookie-consent`) with the consent `version` + a
  timestamp; changing `version` re-prompts. _Out of scope:_ IAB TCF (needs a certified
  CMP), server-side consent logging, automatic cookie-scanning — the inventory is
  editor-maintained.

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

**`<ConsentGate category="…">`** (`@/user-interface/shared/layout/ConsentGate`) — render
children only while that category is granted (mounts on accept, unmounts on withdrawal).
The canonical slot for a pixel/embed/widget:

```tsx
// Meta Pixel — loads only after the visitor accepts "marketing"
<ConsentGate category="marketing">
  <MetaPixel id="123456" />
</ConsentGate>
```

**`<ConsentScript category src …>`** (`@/user-interface/shared/layout/ConsentScript`) — a
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
