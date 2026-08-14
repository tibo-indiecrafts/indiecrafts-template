import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("scan-placeholders runs and reports a file count", () => {
  const r = spawnSync(process.execPath, ["scripts/scan-placeholders.mjs"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Scanned \d+ files/);
});
