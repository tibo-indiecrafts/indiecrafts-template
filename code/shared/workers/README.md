# @indiecrafts/shared-workers

A standalone **Cloudflare Worker** for background jobs — cron, queue consumers, and tasks that
aren't a request in the Next app (`@indiecrafts/web-surfaces-website`). Deployed separately, on its own schedule.

## Quick start

```bash
pnpm install                                       # links the workspace deps
pnpm --filter @indiecrafts/shared-workers dev             # local: wrangler dev (http://localhost:8787)
pnpm --filter @indiecrafts/shared-workers tsc             # typecheck
pnpm deploy:shared:workers:dev   # deploy to the dev Worker
```

- `src/index.ts` — `fetch` (a `/health` probe) + `scheduled` (cron). Put the real job in `scheduled`.
- `wrangler.toml` — per-env Workers, a `[triggers].crons` example, Workers Logs, and commented
  KV/queue binding stubs.
- Secrets: `wrangler secret put <NAME> --env <env>`. Rename `indiecrafts-workers-*` per client.

**Status: scaffold** — it compiles and deploys, but ships no real job and isn't wired to CI yet.
Conventions → `.claude/CLAUDE.md`.
