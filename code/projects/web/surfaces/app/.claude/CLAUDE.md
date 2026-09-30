# `@indiecrafts/web-surfaces-app` — lean web surface (next-cf)

Auto-loads under `code/projects/web/surfaces/app/**`. A lean Next.js surface with a shadcn sidebar
shell wrapping three pages — Home, Account, Legal — over the shared i18n/compliance/version
baseline. **Has a shadcn shell**: `src/user-interface/layout/` (`AppShell` → `AppSidebar` +
`SidebarInset`/`AppHeader`), a flat nav from `src/user-interface/lib/nav.ts` (Home + Account), a
no-flash light/dark `ThemeToggle`, a `LocaleSwitcher`, and `NavUser` (the sidebar footer menu:
Legal + Sign out). Every route in the `(app)` group renders inside `AppShell`; `sign-in` stays
outside the group, unshelled. Pages use the `PageHeader` + shadcn `Card` treatment. These are
**app-owned components — no Storybook**; Storybook's globs cover only the design-system packages,
not app UI.

**Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · next-intl — same stack as `web`.
**Platform class:** `next-cf` (Next → OpenNext → Cloudflare Workers).

Wired baseline:

- **i18n (parity with `website`)** — next-intl locale detection + redirection: `src/i18n/routing.ts`
  (`as-needed` prefixes, `localeDetection`, the namespaced locale cookie — no localized `pathnames` map
  yet), `src/i18n/request.ts` (messages from `messages/<locale>.json`, no Sanity overlay), `src/proxy.ts`
  (`createMiddleware(routing)`), and the `[locale]` segment. Root `layout.tsx` is a passthrough; `[locale]/layout.tsx` owns `<html lang dir>`. Import `Link` from `@/i18n/routing`, never `next/link`.
- **Compliance** — a `/legal` route links out to the website's legal pages
  (`legalUrl(site.websiteUrl, …)`); the consent banner + legal re-acceptance popup mount via
  `src/user-interface/ShellOverlays.tsx` — a thin composition root; each overlay is its own file under
  `user-interface/overlays/` (`ConsentGate` · `LegalGate`, over the shared consent/legal stores in
  `overlays/stores.ts`) using shared `compliance/web` + a `localStorage` store, gated by
  `features.requireConsent` — off by default). `LegalGate` uses the website's **live** legal version
  (`fetchLegalVersion`; static `policyVersion` = offline fallback) so one Sanity bump re-prompts every
  surface; when signed in (`SignedInLegalGate`, Clerk-gated), it syncs acceptance via the api Worker's
  `/v1/consent/legal` — accept on one surface, cleared on all. See [`compliance-shared`](../../../../../docs/packages/shared/compliance.md).
- **Version prompt** — `web-version`'s `UpdatePrompt` + its own `src/app/api/version/route.ts` +
  `src/lib/build-info.ts` (stamped by `scripts/version.mjs` in `build:cf`).
- **E2e** — Playwright journeys (`e2e/journeys/`: `version` · `not-found` · `boot` · `sign-in`) on a
  dedicated port (:3011), `pnpm e2e`; no dataset seed (the home Sanity read falls back). CI-gated in
  `browser-e2e-app`; the `sign-in` journey self-skips without the Clerk test keys.

Instance config (`features` · `consent` — geo cookie-consent regulations · `policyVersion`) lives in `src/config/index.ts`. It is **not** a content
surface — add `packages-web-sanity` (reads), `packages-shared-security` (headers), or any content brick
only when a real page needs it.

- **Deploy:** `pnpm deploy:web:app:<dev|staging|prod>` → the shared `scripts/deploy/next.mjs`; or
  `pnpm deploy:all:<env>`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../../../shared/scripts/lib/apps.mjs).

**Rules:** compose from bricks; **no cross-app imports**; never expose a write token client-side.
