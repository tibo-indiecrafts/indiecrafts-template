---
title: "Cross-platform shell"
description: "How the two UI platforms — web (Next) and mobile (Expo/React Native) — assemble the same app shell (theme · i18n · fonts · status pages · UI foundation) from…"
status: stable
---

# Cross-platform shell

How the two UI platforms — **web** (Next) and **mobile** (Expo/React Native) — assemble the same
_app shell_ (theme · i18n · fonts · status pages · UI foundation) from shared bricks, without
either platform's framework leaking into the other.

## The shell, per platform

Every surface wires the same parts; only the runtime differs.

| Part              | web (Next)                               | mobile (Expo/RN)                        |
| ----------------- | ---------------------------------------- | --------------------------------------- |
| **UI library**    | `packages-web-ui` (shadcn/DOM)           | `packages-mobile-ui-native` (RN)        |
| **Theme**         | `data-theme` + CSS tokens                | `ThemeProvider` over `ui-tokens/native` |
| **i18n**          | next-intl                                | expo-localization + react-intl          |
| **Fonts**         | `next/font` localFont                    | `expo-font` (deferred — see below)      |
| **Status pages**  | `system-pages/web`                       | `system-pages/native`                   |
| **Compliance**    | `compliance/web` banner + `<a>` link-out | `compliance/native` banner + `Linking`  |
| **Update prompt** | `web-version` hook + `UpdatePrompt`      | `AppState` poll + native banner         |
| **Tokens**        | one `tokens.json` → all outputs          | ← same                                  |

**Mobile never touches Next.** The native tree imports only the DOM-safe or
native bricks. `next-intl`, `next/image`, and `next/font` stay in the web app.

## The Next-agnostic rule (portable web bricks)

A shared web brick stays framework-neutral so it can serve any React host, not only Next: **a shared
web component must not import a Next API.** [`system-pages`](/packages/web/system-pages) proves the
pattern — its 404 injects the home link (`LinkComponent`, default a plain `<a>`), so the website passes
its typed `next-intl` `Link` while a plain-React host takes the default. One `web` fork serves both.

> Rule: a brick meant to run outside Next takes framework-specific pieces (links,
> images, routing) as **injected props**, defaulting to the platform-neutral primitive.

## i18n — detect vs format

Locale handling splits into two layers that share the **same** ICU `messages/*.json`:

- **Format** is portable — the ICU message format is identical everywhere. Snippets copy verbatim
  between apps.
- **Detect + render** is per-platform — the runtime formatter differs: next-intl (web),
  **react-intl** (mobile). Device detection is `expo-localization` (mobile). react-intl wants a
  **flat** `id` map, so the mobile shell uses `flattenMessages` (from `packages-shared-config`) and
  merges one shared copy source with its own local strings — its `lib/i18n.ts` owns only the ~2-line
  detect.

Two things the mobile shell reuses from shared bricks instead of duplicating: `flattenMessages`
(`packages-shared-config`) and **`SHELL_COPY`** — the default 404/500 copy per locale, in
`packages-shared-system-pages/shared`, so its status-page wording never drifts. The web
`website` owns its copy in Sanity instead, so it does not read `SHELL_COPY`. The **locale vocabulary**
(`isLocale` · `defaultLocale` · `localeCodes`) comes from `packages-shared-config` everywhere, so both
platforms agree on the supported set.

## Locale — suggest + persist (beyond detect)

Detection picks a first locale; two more pieces are shared across the shells:

- **The suggestion decision is shared** — `pickSuggestedLocale(rankedPrefs, active, supported)`
  (`packages-shared-config`) returns the first supported, ranked preference that differs from the
  active locale, else `null`. Each platform feeds it its own ranked, region-stripped list: the web
  `Accept-Language` parser ([`locale-suggest`](/packages/web/locale-suggest)) or Expo `getLocales()`.
  Only the parser is web-specific.
- **The choice persists** — the `app` surface gets **full next-intl** (detection + redirection: `/`→
  `/en`/`/fr` on first visit, the locale cookie wins after). Mobile has no URLs to redirect,
  so it persists an explicit choice (AsyncStorage) that `getStoredLocale()` reads
  before the device locale — mobile switches at runtime via `IntlProvider` state. **Keys are not
  inlined:** the shell keeps a per-app `STORAGE_KEYS` registry (namespaced by `${site.prefix}`) as the
  one home for key strings — on mobile, `lib/storage` also wraps the read/write never-throw (a
  full/disabled store degrades to "not persisted", never a crash).

## Compliance + version — shared capabilities

Beyond the shell chrome, the shells share two capabilities over portable cores
([`compliance-shared`](/packages/shared/compliance) · [`version`](/packages/web/version)):

- **Legal link-out** — no content re-hosting. Each shell lists the enabled legal pages and opens each
  on the **website** via `legalUrl(websiteUrl, key, locale)`: a plain `<a>` (app) or `Linking.openURL`
  (mobile).
- **Consent + legal re-acceptance** — one copy-injected `ConsentBanner` + `LegalReacceptancePrompt`
  (forked `web`/`native`), gated by a per-shell `requireConsent` flag (off by default, mirroring the
  website), wired to a `localStorage`/`AsyncStorage` store adapter. The **"documents updated → review
  & accept"** popup fires when `needsReacceptance(stored, policyVersion)` — bump the shell's
  `policyVersion` when the legal documents change.
- **Update prompt** — a `/api/version` poll comparing the live deploy id to this bundle's baked id
  (`isUpdateAvailable`, string identity). The **apply** half is platform-limited: web reloads;
  mobile nudges to restart (`expo-updates`/EAS OTA is a follow-up).
- **Offline state** — one branded `OfflineContent` page ([`system-pages`](/packages/web/system-pages),
  forked `web`/`native`) + a per-surface detection hook feeding a non-blocking banner: web uses
  `navigator.onLine` + the `online`/`offline` events (`useSyncExternalStore`); mobile uses
  `@react-native-community/netinfo`. Copy is `SHELL_COPY.offline` (the mobile shell) / `messages.offline` (web). The
  banner auto-hides on reconnect; the full page is for a route that can't render offline. The api-client
  (P0.1) already fails closed `{ ok: false }` on a network error, so the UI shows offline, not a crash.

## Tokens — one source, N outputs

`packages-shared-ui-tokens/src/shared/tokens.json` (DTCG/OKLCH) is the single source. `pnpm
tokens:build` emits: `generated/tokens.css` (web OKLCH), `native/tokens.ts` (RN hex object),
**`generated/nativewind.css`** (NativeWind hex vars), `generated/hex.ts` (PWA manifest mirror). Add a
platform output there — never a second palette.

## The React-types split (mobile only)

The web apps use **React 19** (`@types/react@19`); RN 0.76 uses **React 18** (`@types/react@18`).
A brick that forks to native (`system-pages/native`, `ui-native`) is type-checked under **both**.
When the mobile app's `tsc` compiles those brick sources, it must resolve React's types to **18** —
else it picks the workspace-root 19, whose `ReactNode` (adds `bigint`) is incompatible with
react-native's React-18 component types. The mobile `tsconfig.json` pins this with a types-only
`paths` alias (`"react" → "./node_modules/@types/react"`); Metro resolves the real `react` at
runtime. Web keeps 19. This is the one dependency-graph seam of the multi-platform design.

## Verification limit

Web-side changes are fully build-verified (`pnpm tsc`, `pnpm test`, the website `build`). The **RN
runtime has no host here** — native code is built-to-spec and `tsc`-checked
only; on-device validation is the developer's: `npx expo start` (mobile). Font loading on native is **deferred** —
Satoshi ships as web `.woff2`; RN needs `.ttf`/`.otf`, so the mobile shell renders with the system
font until an `.otf` variant lands in [`ui-fonts`](/packages/shared/ui-fonts).
