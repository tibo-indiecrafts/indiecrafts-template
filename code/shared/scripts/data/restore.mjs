#!/usr/bin/env node
// Registry-driven D1 REVERT — the recovery counterpart to migrate.mjs / backup.mjs.
// After a bad migration or a bad deploy, rewind a D1 to an earlier point in time using
// Cloudflare Time Travel (any minute within the last 30 days). Time Travel uses D1's own
// history, so it needs no dump — and it is itself reversible within the window (a wrong
// restore can be restored forward again), so a revert is never a one-way door.
//
//   node restore.mjs <name>|--all <dev|staging|prod> [--info] \
//     [--timestamp=<ISO|unix>] [--bookmark=<id>] [--yes] [--dry-run]
//
// --info (also the default when neither --timestamp nor --bookmark is given): print the
//   current restore bookmark for the DB — READ-ONLY, never mutates. Grab a bookmark BEFORE
//   a risky op, or find a point to roll back to.
// --timestamp / --bookmark: restore to that point. PROD asks to confirm first (skipped
//   under CI or --yes). --dry-run prints the wrangler command without running it.
//
// Scope: D1 only. A Sanity dataset restores via `pnpm db:restore:content`; kv has no
// restore. For a point OLDER than 30 days, restore from an R2 backup dump (backup.mjs)
// by hand — Time Travel cannot reach it.

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATABASES, ENVS } from "../lib/databases.mjs";
import { APPS } from "../lib/apps.mjs";
import { confirmProd } from "../lib/deploy-shared.mjs";

// Resolve from the repo root (this file is <root>/code/shared/scripts/data/restore.mjs).
const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);

/** wrangler args to restore a D1 (by binding, resolved per-env via `--env`) to a point in
 *  time. Exactly ONE of {timestamp, bookmark} must be set. Pure — unit-testable. */
export function restoreArgs(binding, env, { timestamp, bookmark } = {}) {
  if (Boolean(timestamp) === Boolean(bookmark)) {
    throw new Error(
      "restore needs exactly one of --timestamp=<...> or --bookmark=<...>",
    );
  }
  const point = timestamp
    ? `--timestamp=${timestamp}`
    : `--bookmark=${bookmark}`;
  return ["d1", "time-travel", "restore", binding, "--env", env, point];
}

/** wrangler args to read a D1's current restore bookmark. Read-only. Pure. */
export function infoArgs(binding, env) {
  return ["d1", "time-travel", "info", binding, "--env", env];
}

/** Run `fn` with cwd at the db owner's dir, then restore cwd (so --all across owners is
 *  safe). wrangler.toml resolves against that dir, like migrate.mjs. */
function inOwnerDir(db, fn) {
  const ownerDir = APPS.find((a) => a.slug === db.owner)?.dir;
  const cwd = process.cwd();
  process.chdir(path.resolve(REPO_ROOT, ownerDir ?? "."));
  try {
    return fn();
  } finally {
    process.chdir(cwd);
  }
}

function wrangler(args) {
  const r = spawnSync("wrangler", args, {
    stdio: "inherit",
    env: {
      ...process.env,
      PATH: `${path.resolve("node_modules/.bin")}${path.delimiter}${process.env.PATH ?? ""}`,
    },
  });
  return r.status ?? 0;
}

/** Restore (or --info) ONE registered database. Returns the exit status (0 = ok). */
function restoreOne(db, env, { info, timestamp, bookmark, dry }) {
  if (db.kind === "sanity") {
    console.log(
      `"${db.name}" is a Sanity dataset — restore its content with \`pnpm db:restore:content\`, not Time Travel.`,
    );
    return 0;
  }
  if (db.kind !== "d1") {
    console.log(
      `"${db.kind}" (${db.name}) has no Time Travel restore — skipping.`,
    );
    return 0;
  }
  if (!db.binding) {
    console.error(`D1 "${db.name}" has no "binding" in the registry.`);
    return 1;
  }

  // Read-only when no restore point is given (or --info).
  if (info || (!timestamp && !bookmark)) {
    console.log(`\n▶ restore points for ${db.name} (${env}):`);
    return inOwnerDir(db, () => wrangler(infoArgs(db.binding, env)));
  }

  const args = restoreArgs(db.binding, env, { timestamp, bookmark });
  if (dry) {
    console.log(
      `[dry-run] would restore ${db.name} (${env}): wrangler ${args.join(" ")}`,
    );
    return 0;
  }
  console.log(`\n▶ restoring ${db.name} (${env}) …`);
  return inOwnerDir(db, () => wrangler(args));
}

/** Read a `--flag=value` argument (only the `=` form, to match wrangler's own style). */
function optionValue(argv, name) {
  const prefix = `${name}=`;
  const hit = argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

async function main() {
  const argv = process.argv.slice(2);
  const info = argv.includes("--info");
  const dry = argv.includes("--dry-run");
  const yes = argv.includes("--yes");
  const all = argv.includes("--all");
  const timestamp = optionValue(argv, "--timestamp");
  const bookmark = optionValue(argv, "--bookmark");
  const positional = argv.filter((a) => !a.startsWith("--"));
  const name = all ? null : positional[0];
  const env = all ? positional[0] : positional[1];

  if (!ENVS.includes(env) || (!all && !name)) {
    console.error(
      "Usage: restore.mjs <name>|--all <dev|staging|prod> [--info] [--timestamp=<ISO|unix>] [--bookmark=<id>] [--yes] [--dry-run]",
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
      all ? "No D1 databases registered." : `No database named "${name}".`,
    );
    process.exit(all ? 0 : 1);
  }

  // A real restore mutates the DB — confirm once for the whole invocation on prod
  // (skipped under CI / --yes). --info and --dry-run never mutate, so never confirm.
  const willRestore = !info && (timestamp || bookmark);
  if (willRestore && !dry) {
    await confirmProd("Restore", all ? "all D1 databases" : name, env, { yes });
  }

  let status = 0;
  for (const db of targets) {
    const s = restoreOne(db, env, { info, timestamp, bookmark, dry });
    if (s !== 0) status = s; // remember failure; --all still tries the rest
  }
  process.exit(status);
}

// Run the CLI only when invoked directly — so a test can import the pure helpers above.
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
