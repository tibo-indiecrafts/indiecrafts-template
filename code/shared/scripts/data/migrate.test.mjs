import assert from "node:assert/strict";
import { test } from "node:test";
import { shouldBackupBeforeMigrate } from "./migrate.mjs";

const d1 = { kind: "d1" };
const kv = { kind: "kv" };
const sanity = { kind: "sanity" };

test("pre-migration snapshot fires for every remote d1 schema change", () => {
  // Every schema change (dev/staging/prod are all real remote D1s) gets a snapshot first.
  assert.equal(shouldBackupBeforeMigrate(d1, "prod", {}), true);
  assert.equal(shouldBackupBeforeMigrate(d1, "staging", {}), true);
  assert.equal(shouldBackupBeforeMigrate(d1, "dev", {}), true);
  // --no-backup is the escape hatch.
  assert.equal(
    shouldBackupBeforeMigrate(d1, "prod", { noBackup: true }),
    false,
  );
  // kv/sanity have no schema migrations, so this never applies to them.
  assert.equal(shouldBackupBeforeMigrate(kv, "prod", {}), false);
  assert.equal(shouldBackupBeforeMigrate(sanity, "prod", {}), false);
});
