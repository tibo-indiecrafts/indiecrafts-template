// Shared helpers for the backup scripts (Sanity + D1).

import { readdirSync, mkdirSync, unlinkSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { getWranglerSlug } from "./project.mjs";

/** Filesystem-safe UTC timestamp: `YYYY-MM-DDTHH-MM-SS`. Sorts chronologically. */
export function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Upload a local backup to the per-env R2 backups bucket via wrangler (direct R2
 * API — no binding needed). Exits non-zero with a create-the-bucket hint on failure.
 */
export function uploadToR2(env, key, file) {
  // Follows the project slug (from wrangler.toml), so backups land in this
  // client's own bucket after `pnpm project:rename`.
  const bucket = `${getWranglerSlug()}-backups-${env}`;
  console.log(`Uploading → r2://${bucket}/${key}`);
  const r = spawnSync(
    "wrangler",
    ["r2", "object", "put", `${bucket}/${key}`, "--file", file, "--remote"],
    { stdio: "inherit" },
  );
  if (r.status !== 0) {
    console.error(
      `✗ R2 upload failed. Create the bucket first: wrangler r2 bucket create ${bucket}`,
    );
    process.exit(r.status ?? 1);
  }
}

/**
 * Keep the newest `keep` files whose name starts with `prefix` in `dir`; delete the
 * rest. Backup names are `<prefix><timestamp>.<ext>`, so a lexical sort is chronological
 * — and the prefix scopes retention per source (one dataset, or one db+env).
 */
export function prune(dir, keep = 10, prefix = "") {
  let files;
  try {
    files = readdirSync(dir).filter(
      (f) => f.startsWith(prefix) && statSync(join(dir, f)).isFile(),
    );
  } catch {
    return;
  }
  const stale = files.sort().reverse().slice(keep); // newest first → drop beyond `keep`
  for (const f of stale) unlinkSync(join(dir, f));
  if (stale.length) console.log(`Pruned ${stale.length} old backup(s), kept ${keep}.`);
}
