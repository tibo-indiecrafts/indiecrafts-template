// Back up the Sanity dataset → backups/sanity/<dataset>-<stamp>.tar.gz.
// Local by default; --remote also uploads to the per-env R2 backups bucket.
//
//   pnpm backup:web:sanity                          # local, default dataset
//   pnpm backup:web:sanity -- --remote              # + upload to indiecrafts-web-backups-prod
//   pnpm backup:web:sanity -- <dataset> --remote --env staging
//
// Read-only on the dataset. Needs SANITY_API_READ_TOKEN. Restore: `pnpm content:import`.

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { stamp, ensureDir, uploadToR2, prune } from "./lib/backup-common.mjs";

const args = process.argv.slice(2);
const remote = args.includes("--remote");
const envIdx = args.indexOf("--env");
const env = envIdx !== -1 ? args[envIdx + 1] : "prod";
const dataset =
  args.find((a) => !a.startsWith("--") && a !== env) ||
  process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId || !dataset) {
  console.error("✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID / dataset (see .env.example).");
  process.exit(1);
}
if (!token) {
  console.error("✗ Missing SANITY_API_READ_TOKEN in .env.local.");
  process.exit(1);
}
if (remote && !["dev", "staging", "prod"].includes(env)) {
  console.error("✗ --env must be dev|staging|prod for --remote.");
  process.exit(1);
}

const dir = ensureDir(resolve("backups/sanity"));
const file = `${dataset}-${stamp()}.tar.gz`;
const path = resolve(dir, file);

console.log(`Exporting ${projectId}/${dataset} → ${path}`);
const r = spawnSync("sanity", ["dataset", "export", dataset, path], {
  stdio: "inherit",
  env: { ...process.env, SANITY_AUTH_TOKEN: token },
});
if (r.status !== 0) {
  console.error("✗ Export failed. Is the Sanity CLI installed and the token valid?");
  process.exit(r.status ?? 1);
}

if (remote) uploadToR2(env, `sanity/${file}`, path);
prune(dir, 10, `${dataset}-`);
console.log(`✓ Sanity backup complete${remote ? " (local + R2)" : ""}: ${file}`);
