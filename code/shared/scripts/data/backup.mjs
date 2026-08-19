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
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASES, ENVS } from "../lib/databases.mjs";
import { APPS } from "../lib/apps.mjs";
import { stamp, ensureDir, uploadToR2, prune } from "../lib/backup-common.mjs";

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
  try {
    if (db.kind === "sanity") backupSanity(env, remote);
    else if (db.kind === "d1") backupD1(env, remote);
    else
      console.log(`  – "${db.kind}" backup not wired yet (reserved). Skipped.`);
  } catch (e) {
    console.error(`  ✗ ${db.name}: ${e.message}`);
    failed = true;
  } finally {
    process.chdir(REPO_ROOT);
  }
}
process.exit(failed ? 1 : 0);

// ── recipes (cwd = owner dir) ─────────────────────────────────────────────────
function backupD1(env, remote) {
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
    return;
  }
  const dir = ensureDir(path.resolve("backups/d1"));
  const file = `${dbName}-${env}-${stamp()}.sql`;
  const out = path.resolve(dir, file);
  const r = spawnSync(
    "wrangler",
    ["d1", "export", dbName, "--env", env, "--remote", "--output", out],
    { stdio: "inherit", env: ownerEnv() },
  );
  if (r.status !== 0) throw new Error("wrangler d1 export failed");
  if (remote) uploadToR2(env, `d1/${env}/${file}`, out);
  prune(dir, 10, `${dbName}-${env}-`);
  console.log(`  ✓ D1 backup: ${file}`);
}

function backupSanity(env, remote) {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token =
    process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset)
    throw new Error(
      "missing NEXT_PUBLIC_SANITY_PROJECT_ID / dataset (see .env.example)",
    );
  if (!token) throw new Error("missing SANITY_API_READ_TOKEN in .env.local");
  const dir = ensureDir(path.resolve("backups/sanity"));
  const file = `${dataset}-${stamp()}.tar.gz`;
  const out = path.resolve(dir, file);
  const r = spawnSync("sanity", ["dataset", "export", dataset, out], {
    stdio: "inherit",
    env: { ...ownerEnv(), SANITY_AUTH_TOKEN: token },
  });
  if (r.status !== 0) throw new Error("sanity dataset export failed");
  if (remote) uploadToR2(env, `sanity/${file}`, out);
  prune(dir, 10, `${dataset}-`);
  console.log(`  ✓ Sanity backup: ${file}`);
}
