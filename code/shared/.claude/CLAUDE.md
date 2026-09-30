# code/shared — the cross-cutting tier

Auto-loads under `code/shared/**`. The **top-level shared tier** (a sibling of `projects/` · `packages/` ·
`modules/`) — everything shared across platforms that isn't a reusable brick: the backend **services**, the
**ops** layer, and the **toolchain**. Layered under the root `CLAUDE.md`; each leaf owns its own brief.

- **Services (`worker-cf`)** — `api` (the shared, versioned HTTP JSON API — web-surface servers + partners) · `cron` (scheduled) ·
  `workers` (queue/event + background jobs). Bare Cloudflare Workers (no Next/OpenNext); each is a thin
  **deploy shell** — logic shared with another unit lives in a `code/packages` / `code/modules` brick.
- **Ops** — `db` (dataset schema + migrations + backups) · `infra` (Terraform/provider IaC). `domains` is
  toolchain-only (no folder).
- **Toolchain (`scripts/`)** — the runners in `scripts/{deploy,data,infra,checks,dev}/` + the **machine
  registries** at `scripts/lib/{apps,databases,infra-registry,domains}.mjs` — the source of truth CI +
  deploy read; each row carries its entity's `dir`, so never hard-code a path.

## Rules

- **Run from the repo root** (`pnpm deploy:… / verify`) — never `cd` into a service.
- **Services are shells** — shared job logic goes in a brick; a service keeps inline only logic it alone
  uses (the ≥2-consumer rule — e.g. the `cron` passes live in its `src/index.ts`).
- **`withGuard` is Next-only** (`server-only` breaks the esbuild build) — bare Workers re-implement a tiny
  inline guard (bearer + CF native rate-limit + CORS). Compose the React-free bricks
  (`config`/`logger`/`security`/`sanity`).
- **Adding a service or an entity** → a row in the matching `scripts/lib/*.mjs`; CI fans out from it, no
  per-app workflow edit.

Deploy model → [`code/docs/shared/architecture/platform-deploy.md`](../../docs/shared/architecture/platform-deploy.md).
