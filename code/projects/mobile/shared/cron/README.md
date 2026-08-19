# Reserved — `cron` (mobile/shared)

**Not built — a reserved slot.** This marks where a scheduled Worker (cron trigger) **shared across the `mobile` platform's surfaces** — one backend for every `mobile` app, but not other platforms.

Prefer the cross-platform worker `code/shared/cron` — activate this **only** when the `mobile` platform needs its own cron the cross-platform one can't be.

**To activate** (turn this marker into a real Worker):

1. Scaffold a bare Cloudflare Worker here — `package.json` `@indiecrafts/mobile-cron` + `wrangler.toml` + `src/index.ts` + a `deploy:<slug>:<env>` script delegating to `scripts/deploy-worker.mjs`.
2. Add a row to `scripts/lib/apps.mjs`: `{ slug, pkg: "@indiecrafts/mobile-cron", class: "worker-cf", platform: "mobile", kind: "service", dir: "code/projects/mobile/shared/cron", order: 10 }`.
3. Add a workspace glob `code/projects/*/shared/*` (or list the path) so pnpm resolves it. CI fans out from the registry — no workflow edit.

Reserved, not empty — **delete this folder** if the slot is never needed. See `code/projects/_registry.md`.
