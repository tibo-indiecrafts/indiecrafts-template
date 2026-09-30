---
title: "next-intl Storybook mock"
description: "Static replacement for next-intl and next-intl/server so design-system renderers resolve translations without a real i18n request."
status: stable
---

# next-intl Storybook mock

> Static message map standing in for `next-intl` in the gallery.

## Purpose

The gallery is Vite, not Next, so renderers that read translations have no real i18n request or provider. This module is aliased in `main.ts` to replace `next-intl`, `next-intl/server`, and `next-intl/navigation`. It returns a translator backed by the website's real `messages/en.json` and `messages/fr.json`, for the locale the Locale toolbar picks. A missing key logs a console error and renders its full path, as next-intl does in dev.

## Exports

- `useTranslations(namespace?)` — client hook returning a translator with a `.raw` accessor.
- `getTranslations(arg?)` — server API; accepts a namespace string or `{ locale, namespace }`.
- `LOCALES` — the locales with a messages file (`en`, `fr`); feeds the Locale toolbar.
- `setLocale(locale)` — called by the preview decorator before each render; an unknown locale falls back to `en`.
- `useLocale()` — returns the current toolbar locale.
- `NextIntlClientProvider` — pass-through provider that renders its children.
- `createNavigation()` — inert `next-intl/navigation` stub: `Link` as a plain `<a>`, plus no-op `useRouter` / `usePathname` / `getPathname` / `redirect`.
- `default` — object bundling the named exports above.

## Source

`code/projects/web/tools/storybook/.storybook/next-intl-mock.tsx`
