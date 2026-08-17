import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

test("doctor-env fails clearly when .env.local is missing", () => {
  // Run from an empty temp cwd so there is definitely no .env.local.
  const r = spawnSync(process.execPath, [resolve("code/projects/web/scripts/doctor-env.mjs")], {
    cwd: tmpdir(),
    encoding: "utf8",
  });
  assert.equal(r.status, 1);
  assert.match(r.stderr + r.stdout, /No \.env\.local/);
});
