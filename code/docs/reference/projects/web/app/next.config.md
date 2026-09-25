---
title: "App Next config"
description: "Next.js configuration for the app surface: transpiled bricks and proxy-mode security headers."
status: stable
---

# App Next config

> The `app` surface's Next.js config — a minimal web surface with `next-intl`, compliance, the version prompt, and proxy-mode security headers.

## Purpose

Configures the Next.js build for `@indiecrafts/web-surfaces-app`, a minimal web surface (Next to OpenNext to Worker) with `next-intl` locale detection and redirection, compliance, and the version prompt. It wraps the base config with the `next-intl` plugin, transpiles the workspace bricks it consumes, and emits non-CSP security headers. The per-request nonce CSP is set by `src/proxy.ts`, so `headers()` runs with `cspMode: "proxy"`.

## Exports

- `default` — the `NextConfig` wrapped by `withNextIntl(...)`.

Key behaviors set in the config:

- `transpilePackages` — the `@indiecrafts/*` bricks compiled from source.
- `headers()` — `securityHeaders({ env, cspMode: "proxy" })`; the proxy emits the CSP.

## Source

`code/projects/web/surfaces/app/next.config.ts`
