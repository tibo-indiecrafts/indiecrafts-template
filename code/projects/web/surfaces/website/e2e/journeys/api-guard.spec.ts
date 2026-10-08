import { expect, test } from "@playwright/test";

/**
 * Request-boundary hardening (`withGuard`) asserted directly against the API, for
 * every public mutating route that uses it. Each check short-circuits BEFORE the
 * engine writes anything (the guard itself, or the engine's pure validator), so the
 * suite is fully deterministic and needs no fixtures. Highest security ROI.
 */

type Guarded = {
  path: string;
  /** The route's `withGuard` `bodyMax` (`src/config/security.ts`). */
  bodyMax: number;
  /** A body the route rejects with 400 before any write. */
  invalid: Record<string, unknown> | string;
};

const GUARDED: Guarded[] = [
  { path: "/api/waitlist", bodyMax: 8000, invalid: { email: "not-an-email" } },
  { path: "/api/newsletter", bodyMax: 8000, invalid: { email: "not-an-email" } },
  {
    path: "/api/comments",
    bodyMax: 12000,
    invalid: { postId: "", authorName: "E2E", body: "hi" },
  },
  {
    path: "/api/contact",
    bodyMax: 12000,
    invalid: { email: "not-an-email", message: "hi" },
  },
  {
    path: "/api/data-request",
    bodyMax: 8000,
    invalid: { email: "not-an-email", requestType: "access" },
  },
  // The token is the auth; any token string answers 200 `{status}`, so the 400 is the guard's JSON parse.
  { path: "/api/newsletter/confirm", bodyMax: 4000, invalid: "{not json" },
  {
    path: "/api/views",
    bodyMax: 1000,
    invalid: { postId: "drafts.post.x", locale: "en" },
  },
];

// A form opened a minute ago: `startedAt` must clear the bot check (`isSpam` drops an
// instant submit with a silent 201), or the invalid-email case answers 201, not 400.
const base = { consent: true, honeypot: "", startedAt: Date.now() - 60_000 };

for (const f of GUARDED) {
  test(`${f.path} → 403 on a cross-site POST`, async ({ request }) => {
    const res = await request.post(f.path, {
      headers: { origin: "https://evil.example.com" },
      data: { ...base, email: "e2e@example.com", authorName: "E2E", body: "hi" },
    });
    expect(res.status()).toBe(403);
  });

  test(`${f.path} → 413 on an oversize body`, async ({ request }) => {
    const huge = "x".repeat(f.bodyMax + 1000);
    const res = await request.post(f.path, {
      data: {
        ...base,
        email: "e2e@example.com",
        authorName: "E2E",
        body: huge,
        note: huge,
      },
    });
    expect(res.status()).toBe(413);
  });

  test(`${f.path} → 400 on invalid input`, async ({ request }) => {
    // No Origin header → the guard treats it as a non-browser caller (no CSRF
    // vector) and runs the handler, which rejects the input before any write.
    const res = await request.post(f.path, {
      headers: { "content-type": "application/json" },
      // A string goes as raw bytes: Playwright would JSON-encode it into a valid JSON string.
      data:
        typeof f.invalid === "string"
          ? Buffer.from(f.invalid)
          : { ...base, ...f.invalid },
    });
    expect(res.status()).toBe(400);
  });
}

/**
 * Mutating routes that deliberately skip `withGuard` (the ALLOWLIST in
 * `code/shared/scripts/checks/api-guards.mjs`) — each asserts its OWN rejection.
 * `/api/csp-report` is left out: it always answers 204 by design (a Reporting-API sink).
 */
test("/api/comments/moderate → 400 on an unknown action (token-gated, no write)", async ({
  request,
}) => {
  const res = await request.post("/api/comments/moderate", {
    form: { token: "e2e-not-a-token", action: "hack" },
  });
  expect(res.status()).toBe(400);
});

test("/api/emails/test → 401 without a Sanity editor token", async ({ request }) => {
  const res = await request.post("/api/emails/test", { data: { to: "e2e@example.com" } });
  expect(res.status()).toBe(401);
});

test.describe("Clerk-authenticated loggers", () => {
  // Without Clerk keys `auth()` has no middleware to read, so these only run when
  // a Clerk instance is wired (same switch as `sign-in.spec.ts`).
  test.skip(
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    "no Clerk instance wired for e2e — set the test keys",
  );

  test("/api/session-log → 401 when signed out", async ({ request }) => {
    const res = await request.post("/api/session-log", { data: {} });
    expect(res.status()).toBe(401);
  });

  test("/api/consent-log → 413 on an oversize body", async ({ request }) => {
    const res = await request.post("/api/consent-log", {
      data: { events: [], version: "v1", decisionId: "d", source: "x".repeat(5000) },
    });
    expect(res.status()).toBe(413);
  });
});
