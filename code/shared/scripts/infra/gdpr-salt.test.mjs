import assert from "node:assert/strict";
import { test } from "node:test";
import { generateSalt } from "./gdpr-salt.mjs";

test("generateSalt returns a fresh 32-byte hex salt", () => {
  const a = generateSalt();
  assert.match(a, /^[0-9a-f]{64}$/);
  assert.notEqual(a, generateSalt()); // random each call
});
