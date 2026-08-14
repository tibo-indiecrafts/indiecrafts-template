import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("tags-report --check passes on the clean template", () => {
  const r = spawnSync(process.execPath, ["scripts/tags-report.mjs", "--check"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /canonical vocabulary/);
});

test("tags-report --debt filters to one family", () => {
  const r = spawnSync(process.execPath, ["scripts/tags-report.mjs", "--debt"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /@debt/);
});
