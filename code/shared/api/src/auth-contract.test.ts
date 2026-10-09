/// <reference types="@cloudflare/vitest-pool-workers" />
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";
// The router's own source: every `/v1` path it matches is read from here, so a new route
// cannot ship without a line below.
import routerSource from "./index.ts?raw";

/**
 * Auth contract — every `/v1` route rejects a caller with no credentials. `check:api-guards`
 * scans the Next route files only; the worker's routes are plain `url.pathname` checks in
 * `index.ts`. Auth kinds differ (admin bearer `APP_API_TOKEN`, Clerk session JWT, Svix
 * signature, a signed or single-use token), so the assertion is "not a success": >= 400.
 *
 * Add a new route to `GUARDED` (the method it serves, and a body if it reads one), or to
 * `OPEN` with the reason it is public.
 */
const GUARDED: Record<
  string,
  { method: string; body?: string; suffix?: string }
> = {
  "/v1/events": { method: "POST", body: "{}" },
  "/v1/sessions": { method: "GET" },
  "/v1/consent/history": { method: "GET" },
  "/v1/profiles/consent": { method: "POST", body: "{}" },
  "/v1/security": { method: "GET" },
  "/v1/csp-reports": { method: "GET" },
  "/v1/churn": { method: "GET" },
  "/v1/views": { method: "POST", body: "{}" },
  "/v1/views/top": { method: "GET" },
  "/v1/newsletter/subscribers": { method: "POST", body: "{}" },
  "/v1/contacts/general": { method: "POST", body: "{}" },
  "/v1/emails/test": { method: "POST", body: "{}" },
  "/v1/settings": { method: "PUT", body: "{}" },
  "/v1/backups/status": { method: "GET" },
  "/v1/cron/status": { method: "GET" },
  "/v1/erasure-requests": { method: "GET" },
  "/v1/cron/run": { method: "POST", body: "{}" },
  "/v1/data-request": { method: "POST", body: "{}" },
  "/v1/data-requests": { method: "GET" },
  "/v1/clerk-webhook": { method: "POST", body: "{}" },
  "/v1/erasure/confirm": { method: "POST", body: "{}" },
  "/v1/erasure/self": {
    method: "POST",
    body: JSON.stringify({ email: "x@y.z" }),
  },
  "/v1/erasure/status/": { method: "GET", suffix: "unknown-token" },
  "/v1/consent/marketing-email": { method: "POST", body: "{}" },
  "/v1/consent/legal": { method: "POST", body: "{}" },
  "/v1/consent/email-preferences": { method: "POST", body: "{}" },
  "/v1/email-preferences": { method: "GET" },
  "/v1/email-preferences/unsubscribe": { method: "POST", body: "{}" },
  "/v1/export": { method: "POST", body: JSON.stringify({ email: "x@y.z" }) },
  "/v1/export/download": { method: "GET", suffix: "?token=unknown" },
};

/** Public by design — each is guarded another way. */
const OPEN: Record<string, string> = {
  "/v1/announcements": "published banner content, read by every surface",
  "/v1/erasure/request":
    "a visitor's own request: Turnstile + rate limit + the same answer for any email",
};

/** Every `/v1` path `index.ts` matches, exactly or as a prefix. */
const routes = [
  ...routerSource.matchAll(
    /pathname(?: ===|\.startsWith\()\s*"(\/v1\/[^"]+)"/g,
  ),
].map((m) => m[1]!);

describe("auth contract — every /v1 route rejects an anonymous caller", () => {
  it("knows every route the router matches, and no stale one", () => {
    const known = [...Object.keys(GUARDED), ...Object.keys(OPEN)].sort();
    expect([...new Set(routes)].sort()).toEqual(known);
  });

  for (const [path, { method, body, suffix = "" }] of Object.entries(GUARDED)) {
    it(`${method} ${path} is not reachable without credentials`, async () => {
      const res = await SELF.fetch(`https://example.com${path}${suffix}`, {
        method,
        headers: { "content-type": "application/json" },
        body,
      });
      expect(res.ok, `${method} ${path} answered ${res.status}`).toBe(false);
      expect(res.status).toBeGreaterThanOrEqual(400);
      // The route itself refused: its JSON `{ error }`, not the router's plain-text 404 for
      // an unknown path, and not a 405 for a probe with the wrong method.
      expect(res.status).not.toBe(405);
      const answer = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      expect(
        answer?.error,
        `${method} ${path}: not the route's own refusal`,
      ).toBeTruthy();
    });
  }
});
