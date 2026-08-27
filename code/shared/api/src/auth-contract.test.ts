/// <reference types="@cloudflare/vitest-pool-workers" />
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

// Auth contract: every MUTATING /v1 route must reject an unauthenticated caller.
// check:api-guards scans Next route files only, so the bare worker's /v1 routes
// relied on convention — this locks it. Auth kinds differ (bearer APP_API_TOKEN,
// Clerk JWT, Svix HMAC), so the assertion is "not a success": status >= 400.
//
// Deliberately EXCLUDED (public by design, guarded another way):
//   POST /v1/erasure/request  — Turnstile + rate-limit + anti-enumeration
//   POST /v1/erasure/confirm  — single-use token hash + typed-email + attempt cap
//   GET  /v1/export/download  — single-use token in the query string
const MUTATING: ReadonlyArray<{ path: string; method: string; body: string }> = [
  { path: "/v1/events", method: "POST", body: "{}" },
  { path: "/v1/settings", method: "PUT", body: "{}" },
  { path: "/v1/clerk-webhook", method: "POST", body: "{}" },
  { path: "/v1/data-request", method: "POST", body: "{}" },
  { path: "/v1/erasure/self", method: "POST", body: JSON.stringify({ email: "x@y.z" }) },
  { path: "/v1/export", method: "POST", body: JSON.stringify({ email: "x@y.z" }) },
];

describe("auth contract — mutating /v1 routes reject anonymous callers", () => {
  for (const r of MUTATING) {
    it(`${r.method} ${r.path} is not reachable unauthenticated`, async () => {
      const res = await SELF.fetch(`https://example.com${r.path}`, {
        method: r.method,
        headers: { "content-type": "application/json" },
        body: r.body,
      });
      expect(res.ok, `${r.method} ${r.path} returned ${res.status} (expected a rejection)`).toBe(
        false,
      );
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  }
});
