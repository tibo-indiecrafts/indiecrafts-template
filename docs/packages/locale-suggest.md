# Language suggestion

A "this site is available in {your language}" strip. Lives in the
**`@indiecrafts/locale-suggest`** brick — a Sanity copy singleton + a small client banner
+ a pure detector.

## Why it's narrow

next-intl already redirects a **first** visit to `/` to the browser language
(`localeDetection: true`) and records the `NEXT_LOCALE` cookie (the explicit choice wins
after). So this targets only the **residual mismatch**: a returning visitor or a shared
`/fr/…` link whose active locale ≠ the browser preference. **Suggest, never
auto-redirect** (best practice); language **names**, never flags.

## Pieces

- **`detectPreferredLocale(acceptLanguage, active, locales)`** — pure, unit-tested. The
  top-ranked supported `Accept-Language` locale that ≠ the active one, else `null`.
- **`localeSuggest` singleton** (Studio → **Suggestion de langue**): `message` (with a
  `{language}` placeholder), `switchLabel`, `dismissLabel` (`localeString`) →
  `getLocaleSuggest(locale)`.
- **`LocaleSuggest`** client strip — Switch reuses `useLocaleSwitch`
  (`@indiecrafts/i18n`); Switch or dismiss writes the `locale-suggest` cookie so it stops
  suggesting.

## Wiring

`DefaultLayout` reads `Accept-Language` + the dismiss cookie server-side, runs
`detectPreferredLocale`, and renders the strip only when they disagree (no flash).
`{language}` = `localeMap[code].label` (the target's native name). `localeSuggestSanity` →
the `sharedModules` array in `sanity.config.ts`.

The shared **`useLocaleSwitch`** (prefix swap via next-intl + the blog translated-slug
`/api/i18n/translated-slug` resolve) was extracted into `@indiecrafts/i18n` and is used by
**both** this banner and the header `LocaleSwitcher` — one implementation.

## Deps

`@indiecrafts/ui` · `@indiecrafts/i18n` (`useLocaleSwitch`) · `@indiecrafts/sanity` ·
`@indiecrafts/config` (`site.prefix`). Story: `LocaleSuggest.stories.tsx` (Storybook ›
Chrome).
