import { expect, test } from "@playwright/test";

/**
 * Gated lead-magnet download (`/api/download`). The route verifies a signed,
 * expiring token (`@indiecrafts/packages-shared-gated-delivery`, via the newsletter module)
 * BEFORE it reveals the file URL — so a missing, garbage, or tampered token is a
 * `403`, never a redirect to the CDN. The guard short-circuits before any Sanity
 * read: fully deterministic, no fixtures (like `api-guard`).
 */

const BAD_TOKENS = [
  { name: "missing", qs: "" },
  { name: "empty", qs: "?token=" },
  { name: "garbage", qs: "?token=not-a-real-token" },
  { name: "tampered", qs: "?token=eyJtIjoiZ3VpZGUifQ.deadbeefdeadbeef" },
];

for (const t of BAD_TOKENS) {
  test(`/api/download → 403 on a ${t.name} token, no CDN URL leaked`, async ({
    request,
  }) => {
    // maxRedirects: 0 — a valid token would 3xx-redirect to the file; a bad one must not.
    const res = await request.get(`/api/download${t.qs}`, { maxRedirects: 0 });
    expect(res.status()).toBe(403);
    // The 403 is a JSON error; the file location is never disclosed.
    expect(res.headers()["location"]).toBeUndefined();
  });
}
