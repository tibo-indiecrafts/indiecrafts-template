import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { diffTasks } from "./tasks-sync.mjs";

test("diffTasks flags a script with no task", () => {
  const { missing, orphans } = diffTasks(["dev", "build"], ["dev"]);
  assert.deepEqual(missing, ["build"]);
  assert.deepEqual(orphans, []);
});

test("diffTasks ignores the allowlist (e.g. prepare)", () => {
  const { missing } = diffTasks(["dev", "prepare"], ["dev"]);
  assert.deepEqual(missing, []);
});

test("diffTasks allows a curated per-app task (colon-space label)", () => {
  // `website: verify:contrast` maps to no root script, but the `: ` marks it intentional.
  const { orphans } = diffTasks(["dev"], ["dev", "website: verify:contrast"]);
  assert.deepEqual(orphans, []);
});

test("diffTasks flags a stale task (no script, no per-app prefix)", () => {
  const { orphans } = diffTasks(["dev"], ["dev", "deploy:gone:prod"]);
  assert.deepEqual(orphans, ["deploy:gone:prod"]);
});

test("tasks-sync --check passes against the live repo", () => {
  const r = spawnSync(
    process.execPath,
    ["code/shared/scripts/checks/tasks-sync.mjs", "--check"],
    { encoding: "utf8" },
  );
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
