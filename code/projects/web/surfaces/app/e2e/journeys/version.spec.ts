import { expect, test } from "@playwright/test";

/**
 * The build-id endpoint `@indiecrafts/packages-web-version`'s `UpdatePrompt` polls to notice
 * a new deploy. Deterministic — no auth, no content, no selectors.
 */
test("GET /api/version returns the build id", async ({ request }) => {
  const res = await request.get("/api/version");
  expect(res.status()).toBe(200);
  const body = (await res.json()) as { version?: string; commit?: string };
  expect(typeof body.version).toBe("string");
});
