---
title: Toolchain registries
description: The machine registries under scripts/lib that CI, deploy, and the runners read as the single source of truth.
status: stable
order: 1
---

# Toolchain registries — `code/shared/scripts/lib`

The toolchain lives at `code/shared/scripts`, grouped by concern: the runners in
`scripts/{deploy,data,infra,checks,dev}/` do the work, and `scripts/lib/` holds the **machine
registries** they read. A registry is the single source of truth for one entity — which apps,
databases, infra stacks, and domains exist. Every row carries its entity's `dir`, so a runner never
hard-codes a path. Adding an entity is a one-row change; CI and deploy fan out from the row, with no
per-app workflow edit. Alongside the registries sit shared helper libs (identity, backups, deploy
plumbing) the runners import.

Run everything from the repo root. Each registry is also a small CLI (`node <file> --json …`) that
CI reads for its matrix.

## Registries (source of truth)

### `apps.mjs` — the app registry

Registers every deployable app. Fields: `slug` (id + `deploy:<slug>:<env>` script), `pkg`
(workspace package), `class` (`next-cf` · `worker-cf` · `capacitor` → deploy recipe; `capacitor` is not deployed), `platform`
(`web` · `mobile` · `shared`), `kind` (`surface` · `service` · `tool`), `dir` (the project
directory), `order` (deploy order), and optional `smoke` (post-deploy probe). It also exports
`resourceName(slug, env, prefix)` — the one Cloudflare-name formula `<prefix>-<env>-<tail>`.

**Consumed by:** every runner. `deploy/{all,worker,next}.mjs`, `data/{backup,migrate,restore,secrets,backfill-profiles}.mjs`,
`infra/{run,bindings,teardown,gdpr-salt}.mjs`, `checks/typed-routing.mjs`, `dev/{doctor,refresh,setup,tsc-fast}.mjs`,
plus the CI deploy matrix.

### `databases.mjs` — the database registry

Registers every database. Fields: `name` (id + `db:migrate:<name>:<env>` / `db:backup:<name>:<env>`
script), `kind` (`d1` · `kv` · `postgres` · `supabase` · `sanity` → migrate/backup recipe), `owner`
(the one app slug that binds + migrates it), `binding` (the wrangler binding, d1/kv only),
`altitude` (who shares it), `dir`, `backup` (recipe), and `order` (apply order).

**Consumed by:** `data/{migrate,backup,restore}.mjs`, `deploy/worker.mjs` (deploy-time migrations),
and `dev/doctor.mjs`.

### `infra-registry.mjs` — the infra registry

Registers every IaC stack. Fields: `name` (id + `infra:<name>:<action>:<env>` script), `provider`
(`cloudflare` → recipe), `owner`, `altitude` (`global` · `platform` · `leaf`), `dir` (the stack's
`main.tf` + tfvars), and `order` (apply order).

**Consumed by:** `infra/run.mjs`.

### `domains.mjs` — the domain registry

Registers which app serves which hostname per env. Fields: `app` (the `apps.mjs` slug) and `envs`
(per-env `{ host, aliases?, zone? }`, or `null` for `*.workers.dev`). Helpers: `domainFor`,
`originFor`, `hostsFor`. Everything that needs a host derives it here — the Next build's
`NEXT_PUBLIC_SITE_URL`, the Worker route, and the Terraform tfvars.

**Consumed by:** `deploy/next.mjs` and `deploy/domains.mjs` (the print runner).

## Shared helper libs

These are not entity registries; they are the plumbing the runners share.

| File                | Holds                                                                                                                                          | Consumed by                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `resources.mjs`     | `instanceResources(env, prefix)` — the full list of Cloudflare resources one deployed instance owns, derived from the registries + prefix.     | `infra/teardown.mjs`                                                                                          |
| `project.mjs`       | Project identity: the `<prefix>` (`readSitePrefix`), `renameResourcePrefix`, and `assertRenamed(app, env)` — the shared-account clobber guard. | `deploy/{worker,next}.mjs`, `data/{secrets,backfill-profiles}.mjs`, `infra/{bindings,gdpr-salt,teardown}.mjs` |
| `backup-common.mjs` | Backup helpers: `stamp`, `uploadToR2`, `prune`, `buildBackupRunInsert`, `recordBackupRun` (writes a `backup_runs` row).                        | `data/backup.mjs`                                                                                             |
| `deploy-shared.mjs` | `run(cmd, args)` (spawn + exit on failure) and `confirmProd(action, target, env)` (the interactive prod guard).                                | `deploy/{worker,next}.mjs`, `data/{backup,migrate,restore,secrets}.mjs`, `dev/{setup,refresh}.mjs`            |

Deploy model, platform classes, and CI fan-out → [Platform deploy](/shared/architecture/platform-deploy).
