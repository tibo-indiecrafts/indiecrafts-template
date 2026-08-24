# @indiecrafts/web-surfaces-app — lean web surface (next-cf)

Auto-loads under `code/projects/web/surfaces/app/**`. A minimal Next.js surface with the shared
shell wired — i18n, compliance, and the version prompt over the shared bricks. Build real pages
on top.

**Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · next-intl — same stack as `web`.
**Platform class:** `next-cf` (Next → OpenNext → Cloudflare Workers).

Wired baseline:

- **i18n (parity with `website`)** — next-intl locale detection + redirection: `src/i18n/routing.ts`
  (`as-needed` prefixes, `localeDetection`, the namespaced locale cookie — no localized `pathnames` map
  yet), `src/i18n/request.ts` (messages from `messages/<locale>.json`, no Sanity overlay), `src/proxy.ts`
  (`createMiddleware(routing)`), and the `[locale]` segment. Root `layout.tsx` is a passthrough; `[locale]/layout.tsx` owns `<html lang dir>`. Import `Link` from `@/i18n/routing`, never `next/link`.
- **Compliance** — a `/legal` route links out to the website's legal pages
  (`legalUrl(site.websiteUrl, …)`); the consent banner + legal re-acceptance popup mount via
  `src/user-interface/ShellOverlays.tsx` (shared `compliance/web`, `localStorage` store, gated by
  `features.requireConsent` — off by default). See [`compliance-shared`](../../../../../docs/packages/compliance-shared.md).
- **Version prompt** — `web-version`'s `UpdatePrompt` + its own `src/app/api/version/route.ts` +
  `src/lib/build-info.ts` (stamped by `scripts/version.mjs` in `build:cf`).

Instance config (`features` · `consent` — geo cookie-consent regulations · `policyVersion`) lives in `src/config/index.ts`. It is **not** a content
surface — add `packages-web-sanity` (reads), `packages-shared-security` (headers), or any content brick
only when a real page needs it.

- **Deploy:** `pnpm deploy:web:app:<dev|staging|prod>` → the shared `scripts/deploy/next.mjs`; or
  `pnpm deploy:all:<env>`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../../../shared/scripts/lib/apps.mjs).

**Rules:** compose from bricks; **no cross-app imports**; never expose a write token client-side.
