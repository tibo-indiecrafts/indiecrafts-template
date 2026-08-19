# Reserved — `api` (web/admin)

**Not built — a reserved slot.** This marks where a request/response Worker (HTTP · JSON/GraphQL) **bound to the `admin` surface** — backend logic specific to this one leaf.

A leaf usually **consumes** services, it doesn't own them. Prefer `code/shared/api` (cross-platform) or `code/projects/web/shared/api` (platform). Activate this **only** for genuinely leaf-bound backend logic.

**To activate** (turn this marker into a real Worker):

1. Scaffold a bare Cloudflare Worker here — `package.json` `@indiecrafts/admin-api` + `wrangler.toml` + `src/index.ts` + a `deploy:<slug>:<env>` script delegating to `scripts/deploy-worker.mjs`.
2. Add a row to `scripts/lib/apps.mjs`: `{ slug, pkg: "@indiecrafts/admin-api", class: "worker-cf", platform: "web", kind: "service", dir: "code/projects/web/surfaces/admin/api", order: 10 }`.
3. The leaf path isn't matched by a workspace glob today — add one (e.g. `code/projects/*/surfaces/*/*`) or nest it under a globbed slot when you activate it. CI fans out from the registry — no workflow edit.

Reserved, not empty — **delete this folder** if the slot is never needed. See `code/projects/_registry.md`.
