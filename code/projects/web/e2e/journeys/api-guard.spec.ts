import { expect, test } from "@playwright/test";

/**
 * Request-boundary hardening (`withGuard`) asserted directly against the API.
 * These checks short-circuit BEFORE the engine touches Sanity, so nothing is
 * written — fully deterministic, no fixtures. Highest security ROI.
 */

const GUARDED = [
  { path: "/api/waitlist", bodyMax: 8000, emailForm: true },
  { path: "/api/newsletter", bodyMax: 8000, emailForm: true },
  { path: "/api/comments", bodyMax: 12000, emailForm: false },
];

const base = { consent: true, honeypot: "", startedAt: Date.now() };

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

  if (f.emailForm) {
    test(`${f.path} → 400 on an invalid email`, async ({ request }) => {
      // No Origin header → the guard treats it as a non-browser caller (no CSRF
      // vector) and runs the handler, which rejects the bad email before any write.
      const res = await request.post(f.path, {
        data: { ...base, email: "not-an-email" },
      });
      expect(res.status()).toBe(400);
    });
  }
}
