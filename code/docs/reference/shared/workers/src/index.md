---
title: "Background worker entrypoint"
description: "Standalone Cloudflare Worker skeleton with a health-check fetch and a cron scheduled handler for background jobs."
status: stable
---

# Background worker entrypoint

> The background-jobs deploy shell — a health probe plus an intentional scheduled stub.

## Purpose

The entrypoint of a standalone Cloudflare Worker for work that is not a request in the Next app: cron jobs, queue consumers, and background tasks. It is deployed separately from the web app, with its own Worker and `wrangler.toml`. This is a compilable skeleton: `fetch` answers a `/health` probe and 404s everything else, and `scheduled` is an intentional stub: it logs a tick through `@indiecrafts/packages-shared-logger`, which proves the trigger is wired. The platform's jobs live in `cron`; this slot is for a client's own background work. Add the job logic in a `code/packages` or `code/modules` brick.

## Exports

- `Env` — the bindings and vars available to the Worker (`NEXT_PUBLIC_ENVIRONMENT?`); extend as you add KV/R2/D1/queues.
- `default` — the `ExportedHandler` with `fetch` (HTTP `/health`) and `scheduled` (cron).

## Usage

```ts
// Deployed as a Worker, not imported. Probe the health route:
// curl https://<worker-host>/health
// → { "ok": true, "env": "production" }
```

## Source

`code/shared/workers/src/index.ts`
