import assert from "node:assert/strict";
import { test } from "node:test";
import {
  normalizeUsers,
  resolveAdminAction,
  loadSecret,
} from "./set-admin.mjs";

test("normalizeUsers accepts both the array and {data} response shapes", () => {
  assert.deepEqual(normalizeUsers([{ id: "u1" }]), [{ id: "u1" }]);
  assert.deepEqual(normalizeUsers({ data: [{ id: "u2" }] }), [{ id: "u2" }]);
  assert.deepEqual(normalizeUsers(null), []);
  assert.deepEqual(normalizeUsers({}), []);
});

test("resolveAdminAction — the admin-grant security decision", () => {
  // No user for that email → nothing to grant.
  assert.equal(resolveAdminAction(null), "not-found");
  assert.equal(resolveAdminAction(undefined), "not-found");
  // Already admin → idempotent no-op (no PATCH).
  assert.equal(
    resolveAdminAction({ id: "u1", public_metadata: { role: "admin" } }),
    "already-admin",
  );
  // Unset / missing metadata → grant.
  assert.equal(resolveAdminAction({ id: "u1", public_metadata: {} }), "grant");
  assert.equal(resolveAdminAction({ id: "u1" }), "grant");
  // A DIFFERENT role must still be (re)granted admin — never treated as done.
  assert.equal(
    resolveAdminAction({ id: "u1", public_metadata: { role: "editor" } }),
    "grant",
  );
});

test("loadSecret prefers the CLERK_SECRET_KEY env var", () => {
  const prev = process.env.CLERK_SECRET_KEY;
  process.env.CLERK_SECRET_KEY = "sk_test_env_wins";
  assert.equal(loadSecret(), "sk_test_env_wins");
  if (prev === undefined) delete process.env.CLERK_SECRET_KEY;
  else process.env.CLERK_SECRET_KEY = prev;
});
