# @indiecrafts/shared-cron

A **bare Cloudflare Worker** (no Next/OpenNext) that runs on a schedule
(`[triggers] crons` in `wrangler.toml`). It's a deploy shell — the task logic is
imported from `code/packages/*` / `code/modules/*`, so this stays thin.

## Local

```bash
pnpm --filter @indiecrafts/shared-cron dev                     # wrangler dev
curl "http://localhost:8787/__scheduled?cron=0+*+*+*+*"  # trigger a run locally
```

## Deploy

```bash
pnpm deploy:cron:dev           # this worker → dev
pnpm deploy:cron:prod          # → prod (asks to confirm)
pnpm deploy:all:prod           # every app (api · cron · web), ordered
```

Schedule lives in `wrangler.toml` (`[triggers] crons`, UTC — https://crontab.guru).
Bare `wrangler deploy` bundles `src/` + its `@indiecrafts/*` imports — no build step.
Names + the shared-account guard: `pnpm project:rename <slug>` per client. Full model:
[code/docs/shared/architecture/multi-app.md](../docs/shared/architecture/multi-app.md).
