---
title: "Admin Next config"
description: "Next.js configuration for the admin surface: transpiled bricks and proxy-mode security headers."
status: stable
---

# Admin Next config

> The admin dashboard's Next.js config — a lean, Clerk-gated internal app with `next-intl` and proxy-mode security headers.

## Purpose

Configures the Next.js build for `@indiecrafts/web-surfaces-admin`, the internal Clerk-gated admin app (OpenNext to Worker). It wraps the base config with the `next-intl` plugin, transpiles the workspace bricks it consumes, and emits non-CSP security headers. The per-request nonce CSP is set by `src/proxy.ts`, so `headers()` runs with `cspMode: "proxy"`.

## Exports

- `default` — the `NextConfig` wrapped by `withNextIntl(...)`.

Key behaviors set in the config:

- `transpilePackages` — the `@indiecrafts/*` bricks compiled from source.
- `headers()` — `securityHeaders({ env, cspMode: "proxy" })`; the proxy emits the CSP.

## Source

`code/projects/web/surfaces/admin/next.config.ts`
