# Reserved — `workers` (hybrid/main)

**Not built — a reserved slot.** This marks where a background / queue-consumer Worker **bound to the `main` surface** — backend logic specific to this one leaf.

A leaf usually **consumes** services, it doesn't own them. Prefer `code/shared/workers` (cross-platform) or `code/projects/hybrid/shared/workers` (platform). Activate this **only** for genuinely leaf-bound backend logic.

**To activate** (turn this marker into a real Worker):

1. Scaffold a bare Cloudflare Worker here — `package.json` `@indiecrafts/main-workers` + `wrangler.toml` + `src/index.ts` + a `deploy:<slug>:<env>` script delegating to `scripts/deploy-worker.mjs`.
2. Add a row to `scripts/lib/apps.mjs`: `{ slug, pkg: "@indiecrafts/main-workers", class: "worker-cf", platform: "hybrid", kind: "service", dir: "code/projects/hybrid/surfaces/main/workers", order: 10 }`.
3. The leaf path isn't matched by a workspace glob today — add one (e.g. `code/projects/*/surfaces/*/*`) or nest it under a globbed slot when you activate it. CI fans out from the registry — no workflow edit.

Reserved, not empty — **delete this folder** if the slot is never needed. See `code/projects/_registry.md`.
