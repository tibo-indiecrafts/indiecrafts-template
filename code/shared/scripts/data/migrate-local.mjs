#!/usr/bin/env node
// Apply every D1's migrations to the LOCAL dev state — the one `pnpm dev` uses.
//
//   node code/shared/scripts/data/migrate-local.mjs      (pnpm db:migrate:local)
//
// `pnpm dev` runs the api, cron and workers with `wrangler dev --persist-to <repo>/.wrangler/state`,
// so all three share one local D1/KV/R2 and the cron sees the api's data. This applies the
// registry's D1 migrations (`lib/databases.mjs`, kind d1) into that same dir. Idempotent: an
// already-applied migration is skipped. No backup — local state is disposable (delete
// `.wrangler/state` to start over). The REAL dev D1 is `pnpm db:migrate:all:dev`.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DATABASES } from "../lib/databases.mjs";

const REPO = fileURLToPath(new URL("../../../..", import.meta.url)).replace(
  /\/$/,
  "",
);
export const STATE_DIR = `${REPO}/.wrangler/state`;
export const LOCAL_D1 = DATABASES.filter((d) => d.kind === "d1");

export const migrateLocalArgs = (binding) => [
  "d1",
  "migrations",
  "apply",
  binding,
  "--local",
  "--env",
  "dev",
  "--persist-to",
  STATE_DIR,
];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const db of LOCAL_D1) {
    // Run from the owner's dir (its wrangler.toml names the D1 + migrations_dir).
    const cwd = `${REPO}/${db.dir.replace(/\/db\/[^/]+$/, "")}`;
    console.log(`• ${db.name} (${db.binding}) → local state`);
    const r = spawnSync("npx", ["wrangler", ...migrateLocalArgs(db.binding)], {
      cwd,
      stdio: "inherit",
      env: { ...process.env, CI: "1" }, // non-interactive: no confirm prompt
    });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
  console.log(`✓ local D1s migrated (${STATE_DIR})`);
}
