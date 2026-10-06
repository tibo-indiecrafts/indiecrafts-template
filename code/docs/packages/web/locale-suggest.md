---
title: "Language suggestion"
description: 'A "this site is available in {your language}" strip.'
status: stable
---

# Language suggestion

A "this site is available in {your language}" strip. Lives in the
**`@indiecrafts/packages-web-locale-suggest`** brick — a Sanity copy singleton + a small client banner

- a pure detector.

## Why it's narrow

next-intl already redirects a **first** visit to `/` to the browser language
(`localeDetection: true`) and records the `NEXT_LOCALE` cookie (the explicit choice wins
after). So this targets only the **residual mismatch**: a returning visitor or a shared
`/fr/…` link whose active locale ≠ the browser preference. **Suggest, never
auto-redirect** (best practice); language **names**, never flags.

## Pieces

- **`detectPreferredLocale(acceptLanguage, active, locales)`** — pure, unit-tested. The
  top-ranked supported `Accept-Language` locale that ≠ the active one, else `null`. Only the
  **HTTP-header parser** is web-specific: it parses + ranks `Accept-Language`, then delegates the
  decision to the shared **`pickSuggestedLocale`** (`@indiecrafts/packages-shared-config`, see
  [config](/packages/shared/config)), which a plain-React host can also call over `navigator.languages`.
- **`localeSuggest` singleton** (Studio → **Suggestion de langue**): `message` (with a
  `{language}` placeholder), `switchLabel`, `dismissLabel` (`localeString`) →
  `getLocaleSuggest(locale)`.
- **`LocaleSuggest`** client strip — Switch reuses `useLocaleSwitch`
  (`@indiecrafts/packages-web-i18n`); Switch or dismiss writes the `locale-suggest` cookie so it stops
  suggesting. The website's header `LocaleSwitcher` writes it too (`dismissLocaleSuggest`): a
  language the visitor picked by hand is never contradicted by the strip.

## Wiring

`DefaultLayout` reads `Accept-Language` + the dismiss cookie server-side, runs
`detectPreferredLocale`, and renders the strip only when they disagree (no flash).
`{language}` = `localeMap[code].label` (the target's native name). `localeSuggestSanity` →
the `sharedModules` array in `sanity.config.ts`.

The shared **`useLocaleSwitch`** (prefix swap via next-intl + the blog translated-slug
`/api/i18n/translated-slug` resolve) was extracted into `@indiecrafts/packages-web-i18n` and is used by
**both** this banner and the header `LocaleSwitcher` — one implementation.

## Deps

`@indiecrafts/packages-web-ui` · `@indiecrafts/packages-web-i18n` (`useLocaleSwitch`) · `@indiecrafts/packages-web-sanity` ·
`@indiecrafts/packages-shared-config` (`site.prefix`). Story: `LocaleSuggest.stories.tsx` (Storybook ›
Chrome).
