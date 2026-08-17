// Back up the Cloudflare D1 database for an env → backups/d1/<db>-<env>-<stamp>.sql.
// Local by default; --remote also uploads to the per-env R2 backups bucket.
//
//   pnpm backup:web:d1:prod                 # local
//   pnpm backup:web:d1:prod -- --remote     # + upload to indiecrafts-web-backups-prod
//
// D1 is opt-in — if wrangler.toml has no active [[d1_databases]] block, this is a no-op.
// Restore: prefer D1 Time Travel; else `wrangler d1 execute <db> --file <sql> --env <env> --remote`.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { stamp, ensureDir, uploadToR2, prune } from "./lib/backup-common.mjs";

const env = process.argv[2];
const remote = process.argv.includes("--remote");
if (!["dev", "staging", "prod"].includes(env)) {
  console.error("Usage: backup-d1.mjs <dev|staging|prod> [--remote]");
  process.exit(1);
}

// Read database_name from an ACTIVE (uncommented) [[d1_databases]] block in wrangler.toml.
let db;
try {
  const active = readFileSync(resolve("wrangler.toml"), "utf8")
    .split("\n")
    .filter((l) => !l.trim().startsWith("#"))
    .join("\n");
  if (/\[\[(?:env\.[a-z]+\.)?d1_databases\]\]/.test(active)) {
    db = active.match(/database_name\s*=\s*["']([^"']+)["']/)?.[1];
  }
} catch {
  /* no wrangler.toml */
}
if (!db) {
  console.log(
    "D1 not configured — uncomment [[d1_databases]] in wrangler.toml (see docs/db/). Nothing to back up.",
  );
  process.exit(0);
}

const dir = ensureDir(resolve("backups/d1"));
const file = `${db}-${env}-${stamp()}.sql`;
const path = resolve(dir, file);

// `--remote` on `wrangler d1 export` targets the DEPLOYED D1 (not the local sim).
// The script's own `--remote` flag = also copy the dump to R2.
console.log(`Exporting D1 "${db}" (${env}) → ${path}`);
const r = spawnSync(
  "wrangler",
  ["d1", "export", db, "--env", env, "--remote", "--output", path],
  {
    stdio: "inherit",
  },
);
if (r.status !== 0) {
  console.error("✗ D1 export failed (is the D1 created + are you logged in?).");
  process.exit(r.status ?? 1);
}

if (remote) uploadToR2(env, `d1/${env}/${file}`, path);
prune(dir, 10, `${db}-${env}-`);
console.log(`✓ D1 backup complete${remote ? " (local + R2)" : ""}: ${file}`);
