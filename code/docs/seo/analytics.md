# Analytics & consent mode

The template ships a single, opt-in analytics integration: **Google Analytics 4**, wired to Google Consent Mode and an optional cookie banner. No other provider is bundled. When no measurement ID is set, nothing loads — no script, no `<meta>` tag, no network call.

## Configuration

One field, in `src/config/index.ts`:

```ts
export const analytics = {
  /** Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". */
  googleAnalyticsId: "",
} as const;
```

Empty string = disabled. Drop in a `G-XXXXXXXXXX` ID to turn GA on. There is **no** analytics env var — the ID lives in config alongside the rest of the site data.

## How GA loads

The GA script is injected in `src/app/[locale]/layout.tsx`, only when `analytics.googleAnalyticsId` is truthy, via two `next/script` tags with `strategy="afterInteractive"`:

```tsx
{
  analytics.googleAnalyticsId ? (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${features.cookieBanner ? `gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });\n` : ""}gtag('js', new Date());
gtag('config', '${analytics.googleAnalyticsId}');`}
      </Script>
    </>
  ) : null;
}
```

The behavior depends on `features.cookieBanner`:

- **`cookieBanner: false`** — GA initializes and tracks immediately. Fine outside the EU; risky inside.
- **`cookieBanner: true`** — the init script first sets Consent Mode defaults to `denied` (with `wait_for_update: 500`), so GA holds tracking until the visitor makes a choice.

## The cookie banner

Component: `src/user-interface/shared/layout/CookieBanner.tsx`. Mounted in the layout only when `features.cookieBanner === true`:

```tsx
{
  features.cookieBanner ? <CookieBanner /> : null;
}
```

It's a minimal, bottom-fixed GDPR bar shown on first visit when no choice is stored:

- **Accept** → stores `"accepted"` in `localStorage` (`cookie-consent` key) and pushes a Consent Mode `update` flipping `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` to `granted`.
- **Reject** → stores `"rejected"`; GA stays denied.

The consent push only fires when `analytics.googleAnalyticsId` is set, so the banner degrades gracefully when GA isn't configured. Re-show the banner (to let a visitor change their mind) with `?cookies=manage`.

Consent state is read via `useSyncExternalStore` (per the project's hydration rule — no `useEffect` state-setting), listening on both the native `storage` event and a custom `cookie-consent-change` event so multiple tabs and in-page toggles stay in sync.

Banner copy lives in `messages.<locale>.cookies.*` (`title`, `body`, `learnMore`, `accept`, `reject`), and the "learn more" link points at `/legal`.

## Recommended setups

| Audience       | `googleAnalyticsId` | `cookieBanner` | Result                                           |
| -------------- | ------------------- | -------------- | ------------------------------------------------ |
| No analytics   | `""`                | `false`        | Nothing loads.                                   |
| Non-EU traffic | `"G-…"`             | `false`        | GA tracks immediately, no banner.                |
| EU / GDPR      | `"G-…"`             | `true`         | GA denied by default; tracks only after consent. |

::: warning
Turning on GA for EU traffic without the cookie banner loads GA unconditionally with consent `granted` — a compliance risk. Pair `googleAnalyticsId` with `cookieBanner: true` for EU sites.
:::
