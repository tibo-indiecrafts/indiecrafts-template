# Reserved — `cron` (web/website)

**Not built — a reserved slot.** This marks where a scheduled Worker (cron trigger) **bound to the `website` surface** — backend logic specific to this one leaf.

A leaf usually **consumes** services, it doesn't own them. Prefer `code/shared/cron` (cross-platform) or `code/projects/web/shared/cron` (platform). Activate this **only** for genuinely leaf-bound backend logic.

**To activate** (turn this marker into a real Worker):

1. Scaffold a bare Cloudflare Worker here — `package.json` `@indiecrafts/website-cron` + `wrangler.toml` + `src/index.ts` + a `deploy:<slug>:<env>` script delegating to `scripts/deploy-worker.mjs`.
2. Add a row to `scripts/lib/apps.mjs`: `{ slug, pkg: "@indiecrafts/website-cron", class: "worker-cf", platform: "web", kind: "service", dir: "code/projects/web/surfaces/website/cron", order: 10 }`.
3. The leaf path isn't matched by a workspace glob today — add one (e.g. `code/projects/*/surfaces/*/*`) or nest it under a globbed slot when you activate it. CI fans out from the registry — no workflow edit.

Reserved, not empty — **delete this folder** if the slot is never needed. See `code/projects/_registry.md`.
