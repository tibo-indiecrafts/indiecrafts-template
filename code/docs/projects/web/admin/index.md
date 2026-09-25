---
title: Admin surface
description: The internal, auth-gated operator dashboard for moderation, compliance, and ops.
status: stable
order: 1
---

# Admin surface (`@indiecrafts/web-surfaces-admin`)

## Purpose

> The internal operator dashboard — auth-gated, `noindex`, its own subdomain.

Admin is a separate Next.js app for operators, not the public. It runs moderation,
subscriber and waitlist ops, and dashboards over the shared Sanity dataset (plus
Cloudflare D1 if relational data lands). Every route sits behind auth.

## Stack / Platform class

- **Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui — the same stack as `website`.
- **Platform class:** `next-cf` (Next → OpenNext → Cloudflare Workers).

## Wired baseline

- **Auth gate** — Clerk (`@clerk/nextjs`) wraps the tree via `AppClerkProvider`
  (`@indiecrafts/packages-web-auth`). `src/proxy.ts` gates every route except `/sign-in`
  to an `admin` session and **fails closed**: no session, a non-admin claim, or an
  unverifiable token redirects to sign-in (`isAdmin` from `@indiecrafts/packages-shared-auth`).
  The proxy is coarse routing only; real authorization runs server-side in the
  `(dashboard)` layout and each action or handler (middleware is bypassable — Next.js
  CVE-2025-29927).
- **Before shipping** — an unconfigured Clerk (no `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
  runs the scaffold **ungated**. Configure Clerk and add a Cloudflare Access gate on the
  subdomain first.
- **i18n** — next-intl with the `[locale]` segment and `src/i18n/routing.ts` (`as-needed`
  prefixes). Strings live in `messages/<locale>.json` (`en` · `fr`).
- **Dashboard shell** — `src/user-interface/layout/`: `AppShell` → `AppSidebar` +
  `SidebarInset`/`AppHeader`, a grouped nav from `src/user-interface/lib/nav.ts`, and a
  no-flash light/dark `ThemeToggle`. Pages use a consistent `PageHeader` + `Card`
  treatment. These are app-owned components — no Storybook.
- **Security** — a strict per-request nonce CSP set in `src/proxy.ts`
  (`@indiecrafts/packages-shared-security`), a `/api/csp-report` sink, and session-log
  ingest at `/api/session-log` (`SessionLogger` from `@indiecrafts/packages-web-auth`).
- **Data** — reads over the shared Sanity dataset via `@indiecrafts/packages-web-sanity`.

## Routes / pages

Under `src/app/[locale]/(dashboard)`:

| Group      | Routes                               |
| ---------- | ------------------------------------ |
| Overview   | `/`                                  |
| Access     | `/users` · `/sessions`               |
| Compliance | `/data-requests` · `/csp` · `/churn` |
| Operations | `/backups` · `/system` · `/settings` |
| Security   | `/security`                          |

`/sign-in` is the one public route. API routes: `/api/csp-report` · `/api/session-log`.

## Deploy

```bash
pnpm deploy:web:admin:dev        # or :staging | :prod
```

It runs the shared `code/shared/scripts/deploy/next.mjs`. `pnpm deploy:all:<env>` includes it.

## Registry

One row in `code/shared/scripts/lib/apps.mjs` (slug `admin`, class `next-cf`, order `40`,
dir `code/projects/web/surfaces/admin`). The full deploy model lives in
[platform-deploy](/shared/architecture/platform-deploy); auth is covered in
[auth](/shared/architecture/auth).
