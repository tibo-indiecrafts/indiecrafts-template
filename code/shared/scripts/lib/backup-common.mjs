// Shared helpers for the backup scripts (Sanity + D1).

import {
  readdirSync,
  mkdirSync,
  unlinkSync,
  statSync,
  mkdtempSync,
  writeFileSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { readSitePrefix } from "./project.mjs";
import { DATABASES } from "./databases.mjs";
import { APPS } from "./apps.mjs";

const REPO_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);

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
  // ONE project-wide bucket per env, named from the project PREFIX (not a per-app
  // worker name — so no `-<platform>-<surface>-` in it), keyed `<name>/…` per db.
  // Follows `pnpm project:rename` (the prefix is the renamed slug).
  const bucket = `${readSitePrefix()}-${env}-db-backup`;
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
  if (stale.length)
    console.log(`Pruned ${stale.length} old backup(s), kept ${keep}.`);
}

/**
 * Pure builder: one `backup_runs` row → a parameterized INSERT. No I/O, so it's
 * unit-testable without a live D1. `recordBackupRun` below renders `params` into
 * literals itself (escaped) rather than passing them to `wrangler d1 execute`, which
 * has no placeholder syntax of its own.
 */
export function buildBackupRunInsert({
  dbName,
  env,
  kind,
  r2Key,
  bytes,
  status,
  error,
  startedAt,
  finishedAt,
}) {
  return {
    sql:
      "INSERT INTO backup_runs " +
      "(db_name, env, kind, r2_key, bytes, status, error, started_at, finished_at) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
    params: [dbName, env, kind, r2Key, bytes, status, error, startedAt, finishedAt],
  };
}

function sqlLiteral(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

/**
 * Write one row to `backup_runs` in the api's D1 (the `audit` database), from the
 * api's owner dir — via a temp SQL file + `wrangler d1 execute --file` (avoids
 * shell-escaping bugs with arbitrary `error` labels). FAIL-SOFT: a backup-logging
 * failure must never abort or fail the backup itself, so every error path here just
 * `console.warn`s and returns — never throws, never `process.exit`s.
 */
export function recordBackupRun(env, run) {
  let tmpDir;
  try {
    const apiDir = APPS.find((a) => a.slug === "api")?.dir;
    const auditDb = DATABASES.find((d) => d.name === "audit");
    if (!apiDir || !auditDb) {
      console.warn(
        "recordBackupRun: api app or audit db not in the registry — not logged.",
      );
      return;
    }

    const { sql, params } = buildBackupRunInsert(run);
    let i = 0;
    const rendered = sql.replace(/\?/g, () => sqlLiteral(params[i++]));

    tmpDir = mkdtempSync(join(tmpdir(), "backup-run-"));
    const file = join(tmpDir, "backup-run.sql");
    writeFileSync(file, rendered, { mode: 0o600 });

    process.chdir(resolve(REPO_ROOT, apiDir));
    try {
      const active = readFileSync(resolve("wrangler.toml"), "utf8")
        .split("\n")
        .filter((l) => !l.trim().startsWith("#"))
        .join("\n");
      const dbName = /\[\[(?:env\.[a-z]+\.)?d1_databases\]\]/.test(active)
        ? active.match(/database_name\s*=\s*["']([^"']+)["']/)?.[1]
        : null;
      if (!dbName) {
        console.warn(
          "recordBackupRun: no active D1 database_name in the api's wrangler.toml — not logged.",
        );
        return;
      }
      const r = spawnSync(
        "wrangler",
        ["d1", "execute", dbName, "--env", env, "--remote", "--file", file],
        { stdio: "inherit" },
      );
      if (r.status !== 0 || r.error)
        console.warn("recordBackupRun: wrangler d1 execute failed — not logged.");
    } finally {
      process.chdir(REPO_ROOT);
    }
  } catch (e) {
    console.warn(
      `recordBackupRun: failed to log backup run — ${String(e.message).slice(0, 200)}`,
    );
  } finally {
    if (tmpDir) rmSync(tmpDir, { recursive: true, force: true });
  }
}
