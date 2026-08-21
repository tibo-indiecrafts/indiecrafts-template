#!/usr/bin/env node
// VS Code tasks ↔ root scripts sync guard. `.vscode/tasks.json` mirrors every root
// `package.json` script (discoverable via Run Task, with docs + problem matchers).
// This fails when they drift — a script with no task, or a stale task.
//
//   node code/shared/scripts/checks/tasks-sync.mjs           # report (exit 0)
//   node code/shared/scripts/checks/tasks-sync.mjs --check    # CI: exit 1 on drift
//
// Wired as `pnpm tasks:check` (in `pnpm verify`) + the change-hygiene Stop hook.

import { readFileSync } from "node:fs";
import { join } from "node:path";

// `prepare` is the husky lifecycle — it runs on install, not on demand, so it is
// intentionally NOT a task (see the header in .vscode/tasks.json).
const IGNORE = new Set(["prepare"]);

/**
 * Pure compare. Returns the drift both ways:
 *  - `missing` — a root script with no matching task (must be mirrored).
 *  - `orphans` — a task label that is neither a root script NOR a curated per-app task.
 *
 * Per-app tasks are allowed and identified by a `"<app>: <name>"` label (colon-SPACE) —
 * root-script names never contain a space (they are `foo:bar:baz`), so the two can't
 * collide.
 */
export function diffTasks(scripts, labels, ignore = IGNORE) {
  const labelSet = new Set(labels);
  const scriptSet = new Set(scripts);
  const missing = scripts.filter((s) => !ignore.has(s) && !labelSet.has(s));
  const orphans = labels.filter((l) => !scriptSet.has(l) && !l.includes(": "));
  return { missing, orphans };
}

/** Labels from tasks.json — a JSONC file (comments), so regex, not JSON.parse. */
function extractLabels(jsonc) {
  return [...jsonc.matchAll(/"label"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function main() {
  const root = process.cwd();
  const scripts = Object.keys(
    JSON.parse(readFileSync(join(root, "package.json"), "utf8")).scripts ?? {},
  );
  const labels = extractLabels(
    readFileSync(join(root, ".vscode", "tasks.json"), "utf8"),
  );
  const { missing, orphans } = diffTasks(scripts, labels);

  console.log(
    `=== tasks ↔ scripts ===  (${scripts.length} root scripts, ${labels.length} tasks)`,
  );
  if (missing.length) {
    console.log("\nScripts missing a .vscode/tasks.json task:");
    for (const s of missing) console.log(`  - ${s}`);
  }
  if (orphans.length) {
    console.log(
      "\nTasks with no root script (stale? or missing the `app: ` prefix):",
    );
    for (const o of orphans) console.log(`  - ${o}`);
  }
  if (!missing.length && !orphans.length) {
    console.log("\nIn sync — every root script has a task.");
  }

  if (process.argv.includes("--check") && (missing.length || orphans.length)) {
    console.error(
      "\ntasks:check failed — sync .vscode/tasks.json with the root package.json scripts.",
    );
    process.exit(1);
  }
}

// Run as a CLI only when executed directly (so the test can import `diffTasks`).
if (import.meta.url === `file://${process.argv[1]}`) main();
