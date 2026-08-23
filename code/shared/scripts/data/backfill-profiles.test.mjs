import assert from "node:assert/strict";
import { test } from "node:test";
import { buildUpsertSql } from "./backfill-profiles.mjs";

test("buildUpsertSql escapes quotes and fingerprints deterministically", () => {
  const sql = buildUpsertSql(
    [{ id: "u1", email: "O'Hara@X.com", fullName: "O'Hara" }],
    "salt",
    "2026-01-01T00:00:00.000Z",
  );
  assert.ok(sql.includes("'O''Hara@X.com'")); // SQL-escaped apostrophe
  assert.ok(sql.includes("ON CONFLICT(user_id) DO UPDATE"));
  assert.match(sql, /[0-9a-f]{64}/); // fingerprint present
});

test("fingerprint matches fingerprintEmail's known-answer vector", () => {
  // Same input + expected hex asserted in packages/shared/security crypto.test.ts.
  const sql = buildUpsertSql(
    [{ id: "u2", email: "a@b.com", fullName: null }],
    "salt",
    "2026-01-01T00:00:00.000Z",
  );
  assert.ok(
    sql.includes(
      "d3bdaa92b6373f6067a450fb11488f88965636df6452f34eff6ffaf7803b1db0",
    ),
  );
});
