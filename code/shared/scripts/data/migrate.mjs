#!/usr/bin/env node
// Registry-driven migration runner — reads `scripts/lib/databases.mjs` and dispatches
// on `kind`. Runs from the db owner's dir.
//
//   node scripts/db-migrate.mjs <name> <dev|staging|prod> [--dry-run]
//
// Recipes: d1 → `wrangler d1 migrations apply` (`--local` for dev) · postgres/supabase →
// drizzle-kit / supabase CLI (reserved — not wired) · kv/sanity → no schema migrations.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASES, ENVS } from "../lib/databases.mjs";
import { APPS } from "../lib/apps.mjs";

// Resolve from the repo root (this file is <root>/scripts/db-migrate.mjs).
const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);

const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const [name, env] = args.filter((a) => !a.startsWith("--"));

if (!name || !ENVS.includes(env)) {
  console.error("Usage: db-migrate.mjs <name> <dev|staging|prod> [--dry-run]");
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
if (dry) {
  console.log(
    `[dry-run] would migrate ${db.name} (${db.kind}) via its recipe from ${ownerDir ?? "<no owner dir>"}`,
  );
  process.exit(0);
}
if (db.kind !== "d1") {
  console.error(`migrate recipe for "${db.kind}" is reserved — not wired yet.`);
  process.exit(1);
}

// d1 → wrangler migrations apply, from the owner's dir.
process.chdir(path.resolve(REPO_ROOT, ownerDir ?? "."));
const active = readFileSync(path.resolve("wrangler.toml"), "utf8")
  .split("\n")
  .filter((l) => !l.trim().startsWith("#"))
  .join("\n");
const dbName = active.match(/database_name\s*=\s*["']([^"']+)["']/)?.[1];
if (!dbName) {
  console.error(
    "D1 not configured (no active [[d1_databases]] in wrangler.toml).",
  );
  process.exit(1);
}
const scope = env === "dev" ? ["--local"] : ["--env", env, "--remote"];
const r = spawnSync(
  "wrangler",
  ["d1", "migrations", "apply", dbName, ...scope],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      PATH: `${path.resolve("node_modules/.bin")}${path.delimiter}${process.env.PATH ?? ""}`,
    },
  },
);
process.exit(r.status ?? 0);
