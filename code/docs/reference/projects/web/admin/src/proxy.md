---
title: "Admin proxy and gate"
description: "next-intl locale routing plus the fail-closed admin session gate and CSP headers."
status: stable
---

# Admin proxy and gate

> Locale routing, a fail-closed admin gate, and per-request CSP for the admin surface.

## Purpose

The admin surface middleware. It runs next-intl locale routing, stamps a per-request nonce CSP, and — when Clerk is configured — gates every route except sign-in behind an `admin` session. The gate fails closed: no session, a non-admin claim, or an unverifiable token redirects to sign-in. This is coarse routing only; real authorization is enforced server-side in the dashboard layout and each handler, because middleware is bypassable (Next.js CVE-2025-29927). Unconfigured, the scaffold runs ungated.

## Exports

- `default` — the composed middleware (gated when Clerk is configured, intl-only otherwise).
- `config` — the route matcher (every page path except API, Next internals, metadata routes, and static assets), plus `/api/session-log`: matched only so Clerk attaches the session for `auth()` — the proxy passes `/api` straight through (no sign-in redirect, no locale rewrite).

## Source

`code/projects/web/surfaces/admin/src/proxy.ts`
