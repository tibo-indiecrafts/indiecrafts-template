#!/usr/bin/env node
// Registry-driven migration runner — reads `scripts/lib/databases.mjs` and dispatches
// on `kind`. Runs from the db owner's dir.
//
//   node scripts/db-migrate.mjs <name> <dev|staging|prod> [--dry-run] [--no-backup]
//
// On a REMOTE schema change (staging/prod) it takes a pre-migration R2 snapshot FIRST
// (via `backup.mjs --remote`) — a bad migration is then recoverable. `--no-backup` skips
// it; dev migrates the local, disposable miniflare D1, so no snapshot is taken there.
//
// Recipes: d1 → `wrangler d1 migrations apply` (`--local` for dev) · postgres/supabase →
// drizzle-kit / supabase CLI (reserved — not wired) · kv/sanity → no schema migrations.

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASES, ENVS } from "../lib/databases.mjs";
import { APPS } from "../lib/apps.mjs";

// Resolve from the repo root (this file is <root>/code/shared/scripts/data/migrate.mjs).
const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);

/** Whether a pre-migration R2 snapshot should run before applying `db` in `env`.
 *  Only remote schema changes (staging/prod) need a rollback net — dev is the local,
 *  disposable miniflare D1 — and `--no-backup` opts out. Extracted so it's unit-testable. */
export function shouldBackupBeforeMigrate(db, env, { noBackup } = {}) {
  return db.kind === "d1" && env !== "dev" && !noBackup;
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry-run");
  const noBackup = args.includes("--no-backup");
  const [name, env] = args.filter((a) => !a.startsWith("--"));

  if (!name || !ENVS.includes(env)) {
    console.error(
      "Usage: db-migrate.mjs <name> <dev|staging|prod> [--dry-run] [--no-backup]",
    );
    process.exit(1);
  }

  const db = DATABASES.find((d) => d.name === name);
  if (!db) {
    console.error(`No database named "${name}" in the registry.`);
    process.exit(1);
  }
  const ownerDir = APPS.find((a) => a.slug === db.owner)?.dir;

  if (db.kind === "kv" || db.kind === "sanity") {
    console.log(
      `"${db.kind}" has no schema migrations (${db.name}). Nothing to do.`,
    );
    process.exit(0);
  }

  const willBackup = shouldBackupBeforeMigrate(db, env, { noBackup });

  if (dry) {
    const target =
      db.kind === "d1"
        ? `binding ${db.binding ?? "<none>"} → ${env === "dev" ? "local" : `${env} remote`}`
        : db.backup;
    if (willBackup)
      console.log(
        `[dry-run] would take a pre-migration R2 backup of ${db.name} (${env}) first`,
      );
    console.log(
      `[dry-run] would migrate ${db.name} (${db.kind}) via ${target} from ${ownerDir ?? "<no owner dir>"}`,
    );
    process.exit(0);
  }
  if (db.kind !== "d1") {
    console.error(`migrate recipe for "${db.kind}" is reserved — not wired yet.`);
    process.exit(1);
  }
  if (!db.binding) {
    console.error(
      `D1 "${db.name}" has no "binding" in the registry — add it (e.g. binding: "DB").`,
    );
    process.exit(1);
  }

  // Pre-migration safety snapshot — back up to R2 BEFORE a remote schema change, so a
  // migration that corrupts data is recoverable. Reuses the registry-driven backup recipe
  // (so a future postgres/supabase db gets its own snapshot, for free). Fail-closed: a
  // failed backup aborts the migration — pass `--no-backup` to override.
  if (willBackup) {
    console.log(`\n▶ pre-migration backup of ${db.name} (${env}) → R2 …`);
    const backup = spawnSync(
      process.execPath,
      [
        path.resolve(REPO_ROOT, "code/shared/scripts/data/backup.mjs"),
        db.name,
        env,
        "--remote",
      ],
      { stdio: "inherit" },
    );
    if (backup.status !== 0) {
      console.error(
        "✗ pre-migration backup failed — aborting the migration (pass --no-backup to override).",
      );
      process.exit(1);
    }
  }

  // d1 → wrangler migrations apply, from the owner's dir. Pass the BINDING (not a grepped
  // `database_name`): with `--env`, wrangler resolves the binding to the RIGHT per-env
  // database. dev migrates the LOCAL (miniflare) D1; staging/prod hit the REMOTE.
  process.chdir(path.resolve(REPO_ROOT, ownerDir ?? "."));
  const scope =
    env === "dev" ? ["--env", "dev", "--local"] : ["--env", env, "--remote"];
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
  process.exit(r.status ?? 0);
}

// Run the CLI only when invoked directly — so a test can import the pure helper above.
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
