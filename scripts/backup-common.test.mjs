import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prune } from "../code/projects/web/scripts/lib/backup-common.mjs";

test("prune keeps the newest N and drops the oldest", () => {
  const dir = mkdtempSync(join(tmpdir(), "bk-"));
  try {
    for (let i = 1; i <= 12; i++) {
      const n = String(i).padStart(2, "0");
      writeFileSync(join(dir, `ds-2024-01-01T00-00-${n}.tar.gz`), "x");
    }
    prune(dir, 10, "ds-");
    const left = readdirSync(dir).sort();
    assert.equal(left.length, 10);
    assert.ok(!left.includes("ds-2024-01-01T00-00-01.tar.gz")); // oldest two dropped
    assert.ok(!left.includes("ds-2024-01-01T00-00-02.tar.gz"));
    assert.ok(left.includes("ds-2024-01-01T00-00-12.tar.gz")); // newest kept
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("prune only touches its own prefix (per-source retention)", () => {
  const dir = mkdtempSync(join(tmpdir(), "bk-"));
  try {
    for (let i = 1; i <= 12; i++) writeFileSync(join(dir, `a-${String(i).padStart(2, "0")}.sql`), "x");
    writeFileSync(join(dir, "b-99.sql"), "x"); // different source — untouched
    prune(dir, 10, "a-");
    const left = readdirSync(dir);
    assert.ok(left.includes("b-99.sql"));
    assert.equal(left.filter((f) => f.startsWith("a-")).length, 10);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
