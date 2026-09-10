# Projects — the deployable roster (surfaces · services · tools)

Deployables nest **by platform → kind**: `code/projects/<platform>/<kind>/<name>`
(`kind` = `surfaces` · `services` · `tools`). The **machine source of truth** is the registry
[`scripts/lib/apps.mjs`](../../scripts/lib/apps.mjs) — `{ slug · pkg · class · platform · kind · dir ·
order }`, read by `deploy-all`, every `deploy:<slug>:<env>` runner, `project-rename`, and CI (each reads
`app.dir`). This file is the human roster; keep them in sync (the `apps.test.mjs` guard checks each row's
`dir` exists). Tools (`storybook`, `docs`) are NOT in the machine registry — static, deploy outside
the runtime pipeline.

### `web/` — Next.js → Cloudflare (`next-cf`)

| Dir                  | Package                             | Class     | Deploy                     | Status                                                                                              |
| -------------------- | ----------------------------------- | --------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| **surfaces/website** | `@indiecrafts/web-surfaces-website` | `next-cf` | `deploy:web:website:<env>` | ● live — the app **and** the hub Studio (edits all content)                                         |
| **surfaces/admin**   | `@indiecrafts/web-surfaces-admin`   | `next-cf` | `deploy:web:admin:<env>`   | ◐ real Next scaffold — add a Cloudflare Access gate before shipping                                 |
| **surfaces/app**     | `@indiecrafts/web-surfaces-app`     | `next-cf` | `deploy:web:app:<env>`     | ◐ Hello World scaffold — one page over the shared bricks                                            |
| **tools/storybook**  | `@indiecrafts/web-tools-storybook`  | `static`  | — (build → static host)    | ◐ component gallery — `pnpm --filter @indiecrafts/web-tools-storybook storybook`; not in `apps.mjs` |

### `code/shared/` — cross-platform services (`worker-cf`), consumed by every platform

> The **`shared/` tier is top-level** now (`code/shared/`, a sibling of `projects/`) — it holds everything
> cross-cutting (these services + `db · infra · domains · scripts`). Listed here in the roster because the
> services still deploy; the dirs below are under `code/shared/`, not `code/projects/`.

| Dir         | Package                       | Class       | Deploy                        | Status                                                           |
| ----------- | ----------------------------- | ----------- | ----------------------------- | ---------------------------------------------------------------- |
| **api**     | `@indiecrafts/shared-api`     | `worker-cf` | `deploy:shared:api:<env>`     | ◐ bare Worker — `/health` + audit/session sink `POST /v1/events` |
| **cron**    | `@indiecrafts/shared-cron`    | `worker-cf` | `deploy:shared:cron:<env>`    | ◐ bare Worker scaffold — scheduled handler                       |
| **workers** | `@indiecrafts/shared-workers` | `worker-cf` | `deploy:shared:workers:<env>` | ◐ bare Worker scaffold — background / queue jobs                 |

### `mobile/` — Expo

| Dir                      | Package                             | Class  | Deploy                           | Status                                                               |
| ------------------------ | ----------------------------------- | ------ | -------------------------------- | -------------------------------------------------------------------- |
| **mobile/surfaces/main** | `@indiecrafts/mobile-surfaces-main` | `expo` | `deploy:mobile:main:<env>` (EAS) | ◐ real Expo scaffold, one screen — ships via EAS, **not** Cloudflare |

### Top-level (not under a platform)

| Dir       | Package            | Kind  | Notes                                                                                                                                                     |
| --------- | ------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **docs/** | `indiecrafts-docs` | tools | product docs (VitePress) — **npm-isolated** (excluded from the pnpm workspace); `pnpm docs` / `docs:build`; documents the whole product, not one platform |

## Service scoping — `api` · `cron` · `workers` at three altitudes

A `worker-cf` service (`api` = request/response · `cron` = scheduled · `workers` = background/queue) is
scoped by **who needs it**, and lives at the matching altitude — flat, no `services/` wrapper:

| Altitude                | Path                                                                   | State                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Cross-platform**      | `code/shared/{api,cron,workers}` (top-level, a sibling of `projects/`) | ● **active** — real Workers; the default, serves every platform                                                |
| **Per-platform shared** | `code/projects/<platform>/shared/{api,cron,workers}`                   | ○ reserved marker — activate when a platform needs its own (`@indiecrafts/<platform>-<svc>`)                   |
| **Per-leaf**            | `code/projects/<platform>/surfaces/<leaf>/{api,cron,workers}`          | ○ reserved marker — a surface's own backend; prefer a shared/platform one (a leaf usually _consumes_ services) |

**Reach for the highest altitude that fits** — a leaf backend only when the platform's can't serve it,
a platform backend only when cross-platform can't. Each reserved marker's `README.md` has the activation
steps. Other reserved slots: `projects/<platform>/shared/` also holds code shared across a platform's surfaces.

## Data + ops scoping — `db` · `infra` · `scripts` at four altitudes

Same pattern as services: **a registry keyed by kind + owner + altitude**, runners that dispatch on
kind, instances co-located with their owner. A `db`/`infra`/`scripts` slot exists at every altitude —
each reserved slot is a README marker (activation steps inside).

| Altitude                                | `db/<kind>/` · `infra/<provider>/` · `scripts/`               |
| --------------------------------------- | ------------------------------------------------------------- |
| **global** (the shared tier, top-level) | `code/shared/{db,infra,scripts}`                              |
| **per-platform**                        | `code/projects/<platform>/shared/{db,infra,scripts}`          |
| **per-surface-group**                   | `code/projects/<platform>/surfaces/{db,infra,scripts}`        |
| **per-leaf**                            | `code/projects/<platform>/surfaces/<leaf>/{db,infra,scripts}` |

> **Two shared levels, on purpose:** **`code/shared/`** is the top-level cross-cutting tier (a sibling of
> `projects/ packages/ modules/`) — the global altitude. **`code/projects/<platform>/shared/`** is the
> per-platform tier (shared across one platform's surfaces). Global lives at `code/shared`; anything
> platform-scoped stays under its platform.

The **toolchain** (registries + concern-grouped runners) lives at `code/shared/scripts/`
(`lib/` = registries · `deploy/ data/ infra/ checks/ dev/` = runners). Five machine registries drive
everything — same shape (`--json` CLI + a colocated `*.test.mjs` guard):

- **apps** — `lib/apps.mjs` (`class` → deploy recipe); runners `deploy/{all,next,worker,expo}.mjs`.
- **db** — `lib/databases.mjs`; kinds `d1 · kv · postgres · supabase · sanity`; runners `data/migrate.mjs`
  - `data/backup.mjs` (dispatch on kind). **One db active:** the `sanity` `content` dataset. One owner per db.
- **infra** — `lib/infra-registry.mjs`; provider `cloudflare` (the only wired provider); runner
  `infra/run.mjs`. Real stack: the website's Cloudflare edge (`web/surfaces/website/infra/cloudflare`).
- **domains** — `lib/domains.mjs` (hostname per app × env — the SINGLE source of truth for the host);
  runner `deploy/domains.mjs print` emits the wrangler route + tfvars block + `NEXT_PUBLIC_SITE_URL`
  (which `deploy/next.mjs` exports automatically). Separate axis from `DEFAULT_SITE_PREFIX` (resource names).
- **scope-local scripts** live per altitude (`<altitude>/scripts/`), below the toolchain.

`sanity` is global/content-only; `postgres`/`supabase` are reserved; per-leaf db/infra
carries the same coupling caution as per-leaf services.

**Platform classes** — each has one deploy recipe, dispatched from the registry:
`next-cf` (Next → OpenNext → Cloudflare) · `worker-cf` (bare Cloudflare Worker) ·
`expo` (React Native / EAS). Cloudflare apps ship together via
`pnpm deploy:all:<env>` (`--only cloudflare`, the default); native apps via `deploy:all:<env> --only all`
or their own `deploy:<slug>:<env>`.

**Legend:** ● live · ◐ activated scaffold (real `package.json` + workspace member; placeholder content) · ○ reserved.

**Cloudflare resource naming** — one formula, derived from the tree, single-sourced in
[`scripts/lib/apps.mjs`](../shared/scripts/lib/apps.mjs) `resourceName(slug, env, prefix)`:

> **`<prefix>-<env>-<folder-tail>`** — env-first (prod is explicit, not bare). `<folder-tail>` is
> the app's `dir` under `code/`, minus a leading `projects/`, dash-joined — the same tail as the
> npm package name (`@indiecrafts/<folder-tail>`).

It reads straight off `code/`: `web/surfaces/website` → `indiecrafts-<env>-web-surfaces-website`;
`shared/api` → `indiecrafts-<env>-shared-api`. Every wrangler `name`, R2/KV/D1 stem, and
Terraform `worker_name` derives from it, so `pnpm project:rename <slug>` swaps only the
`<prefix>` (and reaches `code/shared/*`). The clobber guard (`assertRenamed`) refuses a
staging/prod deploy while a name is still on the template prefix `indiecrafts` — one rule,
every app (no `web`-vs-`website` special case).

**Adding an app:** one row in [`scripts/lib/apps.mjs`](../shared/scripts/lib/apps.mjs) + the slot's own
`deploy:<slug>:<env>` script (delegating to a shared runner) + the shared-brick wiring — full steps in
[`.claude/CLAUDE.md`](.claude/CLAUDE.md). CI (build · deploy · preview) fans out from the registry, so
no workflow edit is needed.

**Model:** an app is a **read-lens** over one tenant's shared Sanity dataset; one **hub Studio** edits
everything (desk grouped per app); islands (modules) compose into apps. Deploy + platform architecture →
[`code/docs/shared/architecture/platform-deploy.md`](./docs/shared/architecture/platform-deploy.md);
composition → [`multi-app.md`](./docs/shared/architecture/multi-app.md).
