---
title: "Request proxy"
description: "The Next proxy that runs locale routing, maintenance mode, a strict-nonce CSP, and optional Clerk auth on every request."
status: stable
---

# Request proxy

> The request pipeline — locale, maintenance, CSP nonce, bfcache, and Clerk.

## Purpose

The Next.js proxy (formerly "middleware", renamed in Next 16). It runs next-intl locale routing, site-wide maintenance rewrites, a per-request strict-nonce Content-Security-Policy, and a bfcache-friendly cache header on document navigations. When Clerk is configured, it wraps the pipeline so `auth()` works app-wide. API routes are matched only so Clerk attaches the session, then pass straight through so intl and CSP do not rewrite the endpoint.

## Exports

- `default` — the proxy handler; Clerk-wrapped when a publishable key is bound, otherwise the bare pipeline.
- `config` — the route matcher (page paths plus the locale-aware route handlers and the Clerk-authenticated API routes).

## Source

`code/projects/web/surfaces/website/src/proxy.ts`
