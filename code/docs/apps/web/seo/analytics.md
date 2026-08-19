# Analytics & consent mode

One opt-in analytics integration ships: **Google Analytics 4**, wired to Google Consent Mode and the optional cookie banner. No other provider is bundled. Both the measurement id and the consent behavior are **edited in Sanity** — no config flag, no env var. With no id set, nothing loads: no script, no network call.

## Configuration (in Sanity)

Studio → **Paramètres du site (SEO) → Analytics & cookies** (`siteSettings.analytics`):

| Field                  | Drives                                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `googleAnalyticsId`    | Your GA4 id (`G-XXXXXXXXXX`). Empty = analytics off.                                                                              |
| `requireCookieConsent` | When on, the cookie banner shows and GA is held (Consent Mode `denied`) until the visitor accepts. Turn on for EU / GDPR traffic. |

Read at request time by `getSiteSettings()` (`src/lib/seo/site-seo.ts`) — the sole source, React-`cache()`d, no config fallback. On a Sanity error it returns the empty shape (GA simply off). `pnpm seed` ships demo values.

## How GA loads

Injected in `src/app/[locale]/layout.tsx` (in `<head>`), only when `settings.analytics.googleAnalyticsId` is set, via two `next/script` tags — the gtag loader and an inline `gtag-init`, both `strategy="afterInteractive"`. The Consent Mode `default: denied` preamble is emitted only when `requireCookieConsent` is on:

- **`requireCookieConsent: false`** — GA runs `gtag('js')` + `gtag('config', id)` immediately and tracks. Fine outside the EU; risky inside.
- **`requireCookieConsent: true`** — a `gtag('consent', 'default', …)` call first denies every signal (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`, `functionality_storage`, `personalization_storage`) with `wait_for_update: 500`, so nothing tracks until the visitor chooses.

## The cookie banner

The banner (`CookieBanner`) is a full consent manager — categories, a preferences dialog, a cookie inventory, and per-category Consent-Mode mapping, all edited in Sanity. It is mounted (inside the intl provider) only when `requireCookieConsent` is on. Accepting a category flips its mapped signals to `granted`; the layout's `default: denied` preamble runs first so prior state is respected. Full model, the `useConsent()` / `<ConsentGate>` / `<ConsentScript>` slots, and Consent-Mode mapping → **[Cookie consent](/packages/compliance)**.

## CSP note

Because the GA id is a runtime Sanity value, the build-time CSP can't narrow itself from it — so `next.config.ts` allows Google's hosts **unconditionally**: `https://*.googletagmanager.com` on `script-src`, plus `https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com` on `connect-src`. Harmless when GA is off (no script is emitted). See [Security headers](./security-headers.md).

## Recommended setups

| Audience       | `googleAnalyticsId` | `requireCookieConsent` | Result                                           |
| -------------- | ------------------- | ---------------------- | ------------------------------------------------ |
| No analytics   | empty               | —                      | Nothing loads.                                   |
| Non-EU traffic | `G-…`               | off                    | GA tracks immediately, no banner.                |
| EU / GDPR      | `G-…`               | on                     | GA denied by default; tracks only after consent. |

::: warning
For EU traffic, always pair a GA id with `requireCookieConsent: on`. With it off, GA loads and tracks with no consent gate — a compliance risk.
:::
