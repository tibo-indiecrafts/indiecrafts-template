import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveServerUrl } from "./server-url.ts";

test("returns the origin of a valid CAP_SERVER_URL, trailing slash stripped", () => {
  assert.equal(
    resolveServerUrl({ CAP_SERVER_URL: "http://localhost:3002/" }),
    "http://localhost:3002",
  );
  assert.equal(
    resolveServerUrl({ CAP_SERVER_URL: "https://app.example.com" }),
    "https://app.example.com",
  );
});

test("throws a clear error when CAP_SERVER_URL is unset or empty", () => {
  assert.throws(() => resolveServerUrl({}), /CAP_SERVER_URL/);
  assert.throws(
    () => resolveServerUrl({ CAP_SERVER_URL: "" }),
    /CAP_SERVER_URL/,
  );
});

test("rejects a non-http(s) or malformed URL", () => {
  assert.throws(
    () => resolveServerUrl({ CAP_SERVER_URL: "ftp://x.test" }),
    /http/,
  );
  assert.throws(
    () => resolveServerUrl({ CAP_SERVER_URL: "not a url" }),
    /CAP_SERVER_URL/,
  );
});
