---
title: "App proxy middleware"
description: "The Next.js middleware for the app surface: next-intl routing, opt-in Clerk auth, and the strict CSP."
status: stable
---

# App proxy middleware

> next-intl routing, opt-in Clerk gating, and a per-request CSP nonce.

## Purpose

The Next.js proxy (middleware) for the `app` surface. It runs next-intl locale detection and redirection, and, when Clerk is configured, gates every route except sign-in behind a signed-in user. It generates a per-request CSP nonce, passes it to the layout via `x-nonce`, and stamps the strict nonce CSP (enforce by default, `report-only` via `CSP_MODE`). With no Clerk key it is next-intl only. Gating here is coarse; the real enforcement is the server-side layout gate.

## Exports

- `proxy` (default) — the middleware function (gated or next-intl-only).
- `config` — the route matcher, excluding api, Next internals, metadata routes, and static assets.

## Source

`code/projects/web/surfaces/app/src/proxy.ts`
