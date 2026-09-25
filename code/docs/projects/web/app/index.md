---
title: App surface
description: A lean authenticated web surface with Home, Account, and Legal over the shared baseline.
status: stable
order: 1
---

# App surface (`@indiecrafts/web-surfaces-app`)

## Purpose

> A lean Next.js surface — a shadcn sidebar shell over three pages.

App wraps Home, Account, and Legal in a shadcn shell over the shared
i18n, compliance, and version baseline. It is not a content surface. Add a content brick
(`@indiecrafts/packages-web-sanity`, `@indiecrafts/packages-shared-security`) only when a
real page needs it.

## Stack / Platform class

- **Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · next-intl — the same stack as `website`.
- **Platform class:** `next-cf` (Next → OpenNext → Cloudflare Workers).

## Wired baseline

- **i18n (parity with `website`)** — next-intl locale detection and redirection:
  `src/i18n/routing.ts` (`as-needed` prefixes, `localeDetection`, the namespaced locale
  cookie — no localized `pathnames` map yet), `src/i18n/request.ts` (messages from
  `messages/<locale>.json`, no Sanity overlay), `src/proxy.ts` (`createMiddleware(routing)`),
  and the `[locale]` segment. Import `Link` from `@/i18n/routing`, never `next/link`. See
  [i18n & routing](/projects/web/website/config/i18n-and-routing).
- **Shell** — `src/user-interface/layout/`: `AppShell` → `AppSidebar` +
  `SidebarInset`/`AppHeader`, a flat nav (Home + Account) from `src/user-interface/lib/nav.ts`,
  a no-flash `ThemeToggle`, a `LocaleSwitcher`, and `NavUser` (the footer menu: Legal +
  Sign out). The `(app)` group renders inside `AppShell`; `sign-in` and `sign-up` stay
  outside it, unshelled. Pages use the `PageHeader` + `Card` treatment. App-owned
  components — no Storybook.
- **Auth** — Clerk (`@clerk/nextjs`) with the `sign-in` and `sign-up` routes.
- **Compliance** — `/legal` links out to the website's legal pages
  (`legalUrl(site.websiteUrl, …)`). The consent banner and legal re-acceptance popup mount
  via `src/user-interface/ShellOverlays.tsx` (`ConsentGate` · `LegalGate` over shared
  `compliance/web` + a `localStorage` store), gated by `features.requireConsent` — off by
  default. Account delete and export controls are gated by `features.deleteAccount` and
  `features.exportAccount` (each also needs Clerk and `NEXT_PUBLIC_API_URL`). See
  [compliance](/packages/shared/compliance).
- **Version prompt** — `web-version`'s `UpdatePrompt`, `src/app/api/version/route.ts`, and
  `src/lib/build-info.ts` (stamped by `scripts/version.mjs` in `build:cf`).
- **Security** — a `/api/csp-report` sink and session-log ingest at `/api/session-log`.
- **E2e** — Playwright journeys (`e2e/journeys/`: `version` · `not-found` · `boot` ·
  `sign-in`) on port `:3011`, run with `pnpm e2e`. CI-gated in `browser-e2e-app`; the
  `sign-in` journey self-skips without the Clerk test keys.

Instance config (`features` · `consent` · `policyVersion`) lives in `src/config/index.ts`.

## Routes / pages

Under `src/app/[locale]`:

- `(app)` group — `/` (Home) · `/account` · `/legal`
- Unshelled — `/sign-in` · `/sign-up`
- API — `/api/version` · `/api/csp-report` · `/api/session-log`

## Deploy

```bash
pnpm deploy:web:app:dev          # or :staging | :prod
```

It runs the shared `code/shared/scripts/deploy/next.mjs`. `pnpm deploy:all:<env>` includes it.

## Registry

One row in `code/shared/scripts/lib/apps.mjs` (slug `app`, class `next-cf`, order `45`,
dir `code/projects/web/surfaces/app`, smoke probe `/api/version`). The full deploy model
lives in [platform-deploy](/shared/architecture/platform-deploy).
