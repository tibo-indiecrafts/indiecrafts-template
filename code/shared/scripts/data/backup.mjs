#!/usr/bin/env node
// Registry-driven database backup — reads `scripts/lib/databases.mjs` and dispatches
// on `kind`. Replaces the old per-app `backup-d1.mjs` / `backup-sanity.mjs`.
//
//   node scripts/backup-db.mjs <name> <dev|staging|prod> [--remote] [--dry-run]
//   node scripts/backup-db.mjs --all <env> [--remote]        # every registered db
//
// Each db's backup runs from its OWNER's dir (so `wrangler.toml` / `.env.local` / the
// R2 slug resolve there, exactly like the old app-scoped scripts). `--remote` also
// copies the dump to the per-env R2 backups bucket.
//
// Recipes: sanity → `sanity dataset export` · d1 → `wrangler d1 export` ·
// kv/postgres/supabase → reserved (not wired — skipped with a note).

import { spawnSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASES, ENVS } from "../lib/databases.mjs";
import { APPS } from "../lib/apps.mjs";
import { confirmProd } from "../lib/deploy-shared.mjs";
import {
  stamp,
  ensureDir,
  uploadToR2,
  prune,
  recordBackupRun,
} from "../lib/backup-common.mjs";

// Resolve everything from the repo root (this file is <root>/scripts/backup-db.mjs),
// so the runner works from any cwd (CI, a subdir, …).
const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);
// The owner's CLIs (sanity/wrangler) live in ITS node_modules/.bin — put them on
// PATH for spawns (cwd is the owner dir when a recipe runs).
const ownerEnv = () => ({
  ...process.env,
  PATH: `${path.resolve("node_modules/.bin")}${path.delimiter}${process.env.PATH ?? ""}`,
});

const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const remote = args.includes("--remote");
const all = args.includes("--all");
const yes = args.includes("--yes"); // skip the prod confirm (CI, or migrate's internal call)
// `--kind=` lets a caller (the pre-migration snapshot in migrate.mjs) tag the
// backup_runs row it logs; a direct/manual invocation defaults to "manual".
const kindArg = args.find((a) => a.startsWith("--kind="));
const kind = kindArg ? kindArg.slice("--kind=".length) : "manual";
const positional = args.filter((a) => !a.startsWith("--"));
const name = all ? null : positional[0];
const env = all ? positional[0] : positional[1];

if (!ENVS.includes(env) || (!all && !name)) {
  console.error(
    "Usage: backup-db.mjs <name> <dev|staging|prod> [--remote] [--dry-run]",
  );
  console.error("       backup-db.mjs --all <env> [--remote]");
  process.exit(1);
}

const targets = all ? DATABASES : DATABASES.filter((d) => d.name === name);
if (!targets.length) {
  console.error(
    all
      ? "No databases registered."
      : `No database named "${name}" in the registry.`,
  );
  process.exit(all ? 0 : 1);
}

// A hand-run prod backup confirms first (skipped under CI / --yes). Read-only export, but
// a prod backup also writes a backup_runs row to the prod audit D1 — worth the guard.
if (!dry)
  await confirmProd("Back up", all ? "all databases" : name, env, { yes });

let failed = false;
for (const db of targets) {
  const ownerDir = APPS.find((a) => a.slug === db.owner)?.dir;
  console.log(`\n▶ ${db.name} (${db.kind}, owner ${db.owner}) → ${env}`);
  if (dry) {
    console.log(
      `  [dry-run] would back up via the "${db.backup}" recipe from ${ownerDir ?? "<no owner dir>"}`,
    );
    continue;
  }
  process.chdir(ownerDir ? path.resolve(REPO_ROOT, ownerDir) : REPO_ROOT);
  // Load the owner's local env (Sanity tokens / project id live in its .env.local).
  try {
    process.loadEnvFile(".env.local");
  } catch {
    /* no .env.local — env may be provided by the shell / CI instead */
  }
  const startedAt = new Date().toISOString();
  try {
    let result;
    if (db.kind === "sanity") result = backupSanity(env, remote, db.name);
    else if (db.kind === "d1") result = backupD1(env, remote, db.name);
    else {
      console.log(`  – "${db.kind}" backup not wired yet (reserved). Skipped.`);
      continue;
    }
    recordBackupRun(env, {
      dbName: db.name,
      kind,
      r2Key: result?.r2Key ?? null,
      bytes: result?.bytes ?? null,
      status: "ok",
      error: null,
      startedAt,
      finishedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error(`  ✗ ${db.name}: ${e.message}`);
    failed = true;
    recordBackupRun(env, {
      dbName: db.name,
      kind,
      r2Key: null,
      bytes: null,
      status: "failed",
      error: String(e.message).slice(0, 200),
      startedAt,
      finishedAt: new Date().toISOString(),
    });
  } finally {
    process.chdir(REPO_ROOT);
  }
}
process.exit(failed ? 1 : 0);

// ── recipes (cwd = owner dir) ─────────────────────────────────────────────────
// Local dumps + the R2 key are laid out per registry db `name` (`<name>/<env>/…`), so
// backups stay one-folder-per-db as more databases are added.
function backupD1(env, remote, name) {
  const active = readFileSync(path.resolve("wrangler.toml"), "utf8")
    .split("\n")
    .filter((l) => !l.trim().startsWith("#"))
    .join("\n");
  const dbName = /\[\[(?:env\.[a-z]+\.)?d1_databases\]\]/.test(active)
    ? active.match(/database_name\s*=\s*["']([^"']+)["']/)?.[1]
    : null;
  if (!dbName) {
    console.log(
      "  D1 not configured (no active [[d1_databases]]). Nothing to back up.",
    );
    return { r2Key: null, bytes: null };
  }
  const dir = ensureDir(path.resolve(`backups/${name}`));
  const file = `${dbName}-${env}-${stamp()}.sql`;
  const out = path.resolve(dir, file);
  const r = spawnSync(
    "wrangler",
    ["d1", "export", dbName, "--env", env, "--remote", "--output", out],
    { stdio: "inherit", env: ownerEnv() },
  );
  if (r.status !== 0) throw new Error("wrangler d1 export failed");
  const bytes = statSync(out).size;
  let r2Key = null;
  if (remote) {
    r2Key = `${name}/${file}`; // bucket is per-env → key is `<name>/…`
    uploadToR2(env, r2Key, out);
  }
  prune(dir, 10, `${dbName}-${env}-`);
  console.log(`  ✓ D1 backup: ${file}`);
  return { r2Key, bytes };
}

function backupSanity(env, remote, name) {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token =
    process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset)
    throw new Error(
      "missing NEXT_PUBLIC_SANITY_PROJECT_ID / dataset (see .env.example)",
    );
  if (!token) throw new Error("missing SANITY_API_READ_TOKEN in .env.local");
  const dir = ensureDir(path.resolve(`backups/${name}`));
  const file = `${dataset}-${stamp()}.tar.gz`;
  const out = path.resolve(dir, file);
  const r = spawnSync("sanity", ["dataset", "export", dataset, out], {
    stdio: "inherit",
    env: { ...ownerEnv(), SANITY_AUTH_TOKEN: token },
  });
  if (r.status !== 0) throw new Error("sanity dataset export failed");
  const bytes = statSync(out).size;
  let r2Key = null;
  if (remote) {
    r2Key = `${name}/${file}`; // bucket is per-env → key is `<name>/…`
    uploadToR2(env, r2Key, out);
  }
  prune(dir, 10, `${dataset}-`);
  console.log(`  ✓ Sanity backup: ${file}`);
  return { r2Key, bytes };
}
