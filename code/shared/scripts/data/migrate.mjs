#!/usr/bin/env node
// Registry-driven migration runner — reads `scripts/lib/databases.mjs` and dispatches
// on `kind`. Runs from the db owner's dir.
//
//   node scripts/data/migrate.mjs <name>|--all <local|dev|staging|prod> [--dry-run] [--no-backup] [--yes]
//
// TIERS:
//   local              → the disposable miniflare D1 (`--env dev --local`). Offline, no
//                        real database_id needed, no snapshot. This is what `pnpm dev` uses.
//   dev/staging/prod   → the REAL remote D1 (`--env <env> --remote`). A pre-migration R2
//                        snapshot runs FIRST (via `backup.mjs --remote`) so a bad migration
//                        is recoverable; a FAILED snapshot ABORTS the migration (fail-closed).
//                        `--no-backup` opts out. A prod migration asks to confirm first
//                        (skipped under CI or `--yes`).
//
// Recipes: d1 → `wrangler d1 migrations apply` · postgres/supabase → drizzle-kit / supabase
// CLI (reserved) · kv/sanity → no schema migrations.

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASES, ENVS } from "../lib/databases.mjs";
import { APPS } from "../lib/apps.mjs";
import { confirmProd } from "../lib/deploy-shared.mjs";

// Resolve from the repo root (this file is <root>/code/shared/scripts/data/migrate.mjs).
const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);

// `local` is the miniflare tier (migrate-only — you never deploy or back up miniflare);
// dev/staging/prod are the real remote environments.
const MIGRATE_ENVS = ["local", ...ENVS];

/** Whether a pre-migration R2 snapshot should run before applying `db` in `env`.
 *  Only REMOTE schema changes (dev/staging/prod) need a rollback net — `local` is the
 *  disposable miniflare D1 — and `--no-backup` opts out. Extracted so it's unit-testable. */
export function shouldBackupBeforeMigrate(db, env, { noBackup } = {}) {
  return db.kind === "d1" && env !== "local" && !noBackup;
}

/** Apply migrations for ONE registered database. Returns the exit status (0 = ok). */
function migrateOne(db, env, { dry, noBackup }) {
  const ownerDir = APPS.find((a) => a.slug === db.owner)?.dir;

  if (db.kind === "kv" || db.kind === "sanity") {
    console.log(
      `"${db.kind}" has no schema migrations (${db.name}). Nothing to do.`,
    );
    return 0;
  }
  if (db.kind !== "d1") {
    console.error(`migrate recipe for "${db.kind}" is reserved — not wired yet.`);
    return 1;
  }
  if (!db.binding) {
    console.error(
      `D1 "${db.name}" has no "binding" in the registry — add it (e.g. binding: "DB").`,
    );
    return 1;
  }

  const willBackup = shouldBackupBeforeMigrate(db, env, { noBackup });
  // Pass the BINDING (not a grepped database_name): with `--env`, wrangler resolves the
  // binding to the RIGHT per-env database. `local` applies to the miniflare D1; the real
  // envs hit the remote.
  const scope =
    env === "local" ? ["--env", "dev", "--local"] : ["--env", env, "--remote"];

  if (dry) {
    const where = env === "local" ? "local miniflare" : `${env} remote`;
    if (willBackup)
      console.log(
        `[dry-run] would take a pre-migration R2 backup of ${db.name} (${env}) first`,
      );
    console.log(
      `[dry-run] would migrate ${db.name} (binding ${db.binding}) → ${where} from ${ownerDir ?? "<no owner dir>"}`,
    );
    return 0;
  }

  // Pre-migration safety snapshot — fail-closed. `--yes` so this internal backup never
  // re-prompts (the migration already confirmed prod upstream, once, in main()).
  if (willBackup) {
    console.log(`\n▶ pre-migration backup of ${db.name} (${env}) → R2 …`);
    const backup = spawnSync(
      process.execPath,
      [
        path.resolve(REPO_ROOT, "code/shared/scripts/data/backup.mjs"),
        db.name,
        env,
        "--remote",
        "--kind=pre-migration",
        "--yes",
      ],
      { stdio: "inherit" },
    );
    if (backup.status !== 0) {
      console.error(
        "✗ pre-migration backup failed — aborting the migration (pass --no-backup to override).",
      );
      return 1;
    }
  }

  process.chdir(path.resolve(REPO_ROOT, ownerDir ?? "."));
  const r = spawnSync(
    "wrangler",
    ["d1", "migrations", "apply", db.binding, ...scope],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        PATH: `${path.resolve("node_modules/.bin")}${path.delimiter}${process.env.PATH ?? ""}`,
      },
    },
  );
  return r.status ?? 0;
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry-run");
  const noBackup = args.includes("--no-backup");
  const yes = args.includes("--yes");
  const all = args.includes("--all");
  const positional = args.filter((a) => !a.startsWith("--"));
  const name = all ? null : positional[0];
  const env = all ? positional[0] : positional[1];

  if (!MIGRATE_ENVS.includes(env) || (!all && !name)) {
    console.error(
      "Usage: migrate.mjs <name>|--all <local|dev|staging|prod> [--dry-run] [--no-backup] [--yes]",
    );
    process.exit(1);
  }

  const targets = all
    ? DATABASES.filter((d) => d.kind === "d1").sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      )
    : DATABASES.filter((d) => d.name === name);
  if (!targets.length) {
    console.error(
      all
        ? "No D1 databases registered."
        : `No database named "${name}" in the registry.`,
    );
    process.exit(all ? 0 : 1);
  }

  // One prod confirmation for the whole invocation (skipped under CI / --yes); the
  // per-db pre-migration backups run with --yes so they never re-prompt.
  if (!dry)
    await confirmProd("Migrate", all ? "all D1 databases" : name, env, { yes });

  let status = 0;
  for (const db of targets) {
    const s = migrateOne(db, env, { dry, noBackup });
    if (s !== 0) status = s; // remember failure; --all still tries the rest
  }
  process.exit(status);
}

// Run the CLI only when invoked directly — so a test can import the pure helper above.
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
