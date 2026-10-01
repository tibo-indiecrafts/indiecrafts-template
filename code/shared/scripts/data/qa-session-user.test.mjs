import assert from "node:assert/strict";
import { test } from "node:test";
import {
  envValue,
  assertDevKey,
  sessionEvent,
  parseArgs,
} from "./qa-session-user.mjs";

test("envValue reads one key from .env text, ignoring comments and other keys", () => {
  const text =
    "# comment\nAPI_URL=http://localhost:8787\nAPP_API_TOKEN=abc=def\n";
  assert.equal(envValue(text, "API_URL"), "http://localhost:8787");
  // Only the first `=` splits — a token may contain `=`.
  assert.equal(envValue(text, "APP_API_TOKEN"), "abc=def");
  assert.equal(envValue(text, "MISSING"), null);
  assert.equal(envValue("", "API_URL"), null);
});

test("assertDevKey refuses anything but a development Clerk key", () => {
  assert.doesNotThrow(() => assertDevKey("sk_test_x"));
  // A test user + fake sessions must never land in production.
  assert.throws(() => assertDevKey("sk_live_x"), /development/);
  assert.throws(() => assertDevKey(null), /development/);
});

test("sessionEvent is the api's session-log payload", () => {
  assert.deepEqual(sessionEvent("website", "user_1", "sess_1"), {
    kind: "session",
    surface: "website",
    userId: "user_1",
    sessionId: "sess_1",
  });
});

test("parseArgs: default 2 sessions, --sessions N, --delete", () => {
  assert.deepEqual(parseArgs([]), { sessions: 2, del: false });
  assert.deepEqual(parseArgs(["--sessions", "3"]), { sessions: 3, del: false });
  assert.deepEqual(parseArgs(["--delete"]), { sessions: 2, del: true });
  assert.throws(() => parseArgs(["--sessions", "0"]), /1–10/);
  assert.throws(() => parseArgs(["--sessions", "x"]), /1–10/);
});
