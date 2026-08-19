# Reserved — `workers` (web/shared)

**Not built — a reserved slot.** This marks where a background / queue-consumer Worker **shared across the `web` platform's surfaces** — one backend for every `web` app, but not other platforms.

Prefer the cross-platform worker `code/shared/workers` — activate this **only** when the `web` platform needs its own workers the cross-platform one can't be.

**To activate** (turn this marker into a real Worker):

1. Scaffold a bare Cloudflare Worker here — `package.json` `@indiecrafts/web-workers` + `wrangler.toml` + `src/index.ts` + a `deploy:<slug>:<env>` script delegating to `scripts/deploy-worker.mjs`.
2. Add a row to `scripts/lib/apps.mjs`: `{ slug, pkg: "@indiecrafts/web-workers", class: "worker-cf", platform: "web", kind: "service", dir: "code/projects/web/shared/workers", order: 10 }`.
3. Add a workspace glob `code/projects/*/shared/*` (or list the path) so pnpm resolves it. CI fans out from the registry — no workflow edit.

Reserved, not empty — **delete this folder** if the slot is never needed. See `code/projects/_registry.md`.
