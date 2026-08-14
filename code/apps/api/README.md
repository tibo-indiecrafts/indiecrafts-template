# @indiecrafts/api

A **bare Cloudflare Worker** (no Next/OpenNext) serving an HTTP API. It's a deploy
shell — the real logic is imported from `code/packages/*` / `code/modules/*` bricks,
so this stays thin. Copy this folder to spin up another worker.

## Local

```bash
pnpm --filter @indiecrafts/api dev          # wrangler dev (local workerd)
pnpm --filter @indiecrafts/api cf-typegen   # regenerate worker-configuration.d.ts after binding changes
```

`GET /health` → `{ ok: true }`. Add routes in `src/index.ts`.

## Deploy

```bash
pnpm deploy:api:dev            # this worker → dev
pnpm deploy:api:prod           # → prod (asks to confirm)
pnpm deploy:all:prod           # every app (api · cron · web), ordered
```

Bare `wrangler deploy` bundles `src/` + its `@indiecrafts/*` imports — no build step
(unlike the web app's OpenNext build). Names + the shared-account guard: run
`pnpm project:rename <slug>` per client. Full model:
[docs/shared/architecture/multi-app.md](../../../docs/shared/architecture/multi-app.md).
