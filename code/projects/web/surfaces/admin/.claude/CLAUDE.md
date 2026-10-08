# `@indiecrafts/web-surfaces-admin` — internal admin dashboard (next-cf)

Auto-loads under `code/projects/web/surfaces/admin/**`. A **separate, auth-gated Next.js app** for operators: users and
roles, sessions, GDPR requests, CSP and security feeds, backups, cron, system health and settings —
read from Clerk and the shared api (EU D1). Not public — behind auth, `noindex`, its own subdomain.
Page map → [`code/docs/projects/web/admin/index.md`](../../../../../docs/projects/web/admin/index.md). **Has a shadcn dashboard
shell**: `src/user-interface/layout/` (`AppShell` → `AppSidebar` + `SidebarInset`/`AppHeader`, a grouped
nav driven by `src/user-interface/lib/nav.ts`, a no-flash light/dark `ThemeToggle`, a `LocaleSwitcher`) and a consistent
shadcn page treatment (`PageHeader` + `Card`, shadcn `Table`/`Badge`, `Input`/`Label` + `sonner` toasts)
across every page. These are **app-owned components — no Storybook**; Storybook's globs only cover the
design-system packages, not app UI.

**Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui — same stack as `web`.
**Platform class:** `next-cf` (Next → OpenNext → Cloudflare Workers).

Shared bricks are wired (`transpilePackages` + deps + tsconfig `paths` + `@source`): reuse
`@indiecrafts/packages-web-ui` for the UI and `@indiecrafts/packages-shared-security` for headers. No Sanity
reads yet (`packages-web-sanity` is wired, unused); operator copy lives in `messages/`. Ships its own
`src/config` (app-instance).

- **Auth gate (fails closed):** Clerk `isAdmin` in `src/proxy.ts` (routing only) **and**
  `requireAdminPage` (`src/lib/require-admin.ts`) in the `(dashboard)` layout **and every page** before it
  reads data (Next skips a layout on client navigation; `page-gate.test.ts` enforces it); every server
  action re-checks with `requireAdmin` and audits via `src/lib/audit.ts`.
  Before go-live, add a Cloudflare Access gate on the subdomain.
- **Dates:** next-intl `getFormatter`/`useFormatter` only (UTC, set in `src/i18n/request.ts`) — never
  `toLocaleString`, which breaks hydration in client tables.
- **Deploy:** `pnpm deploy:web:admin:<dev|staging|prod>` → the shared `shared/scripts/deploy/next.mjs`; or
  `pnpm deploy:all:<env>`.
- **Registry:** a row in [`scripts/lib/apps.mjs`](../../../../../shared/scripts/lib/apps.mjs); full deploy model →
  [`code/docs/shared/architecture/platform-deploy.md`](../../../../../docs/shared/architecture/platform-deploy.md).

**Rules:** compose from bricks; **no cross-app imports**; never expose a write token client-side.
