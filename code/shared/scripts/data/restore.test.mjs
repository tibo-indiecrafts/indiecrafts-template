import assert from "node:assert/strict";
import { test } from "node:test";
import { restoreArgs, infoArgs } from "./restore.mjs";

test("restoreArgs builds a Time Travel restore by timestamp", () => {
  assert.deepEqual(
    restoreArgs("MAIN_DB", "prod", { timestamp: "2026-09-21T10:00:00Z" }),
    [
      "d1",
      "time-travel",
      "restore",
      "MAIN_DB",
      "--env",
      "prod",
      "--timestamp=2026-09-21T10:00:00Z",
    ],
  );
});

test("restoreArgs builds a Time Travel restore by bookmark", () => {
  assert.deepEqual(restoreArgs("DB", "dev", { bookmark: "00000041-abc" }), [
    "d1",
    "time-travel",
    "restore",
    "DB",
    "--env",
    "dev",
    "--bookmark=00000041-abc",
  ]);
});

test("restoreArgs requires exactly one restore point", () => {
  // Neither → error (nothing to restore to).
  assert.throws(() => restoreArgs("DB", "dev", {}));
  // Both → error (ambiguous).
  assert.throws(() =>
    restoreArgs("DB", "dev", { timestamp: "t", bookmark: "b" }),
  );
});

test("infoArgs is read-only (no restore verb)", () => {
  assert.deepEqual(infoArgs("DB", "dev"), [
    "d1",
    "time-travel",
    "info",
    "DB",
    "--env",
    "dev",
  ]);
});
