import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

// The script runs on import (no exports), so drive its CLI as a subprocess.
// Run from the repo root — `pnpm test:scripts` invokes node from there.
const run = (args) =>
  spawnSync("node", ["code/shared/scripts/deploy/all.mjs", ...args], {
    encoding: "utf8",
  });

test("rejects an invalid or missing env", () => {
  assert.equal(run([]).status, 1);
  const r = run(["bogus"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Usage/);
});

test("--dry-run lists the website app and deploys nothing (exit 0)", () => {
  const r = run(["dev", "--dry-run"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /deploy:all → dev/);
  assert.match(r.stdout, /\bwebsite\b/);
});
