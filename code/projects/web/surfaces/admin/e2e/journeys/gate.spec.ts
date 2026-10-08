import { expect, test, type Response } from "@playwright/test";
import messages from "../../messages/en.json";

/**
 * Admin gate — signed out, with NO credentials, the admin must fail closed. Runs in both
 * modes: Clerk unconfigured (the `(dashboard)` gate redirects) and Clerk wired (the proxy
 * redirects first). Every dashboard route lands on sign-in, and no served HTML document on
 * the way carries the dashboard shell. The sign-in page and the CSP-report sink answer as designed.
 */
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const SIGN_IN = /\/sign-in(\/|\?|$)/;
// The shadcn sidebar is the dashboard shell — on sign-in it must never appear.
const SHELL = '[data-slot^="sidebar"]';
const DASHBOARD = ["/en", "/en/users", "/en/sessions", "/en/security", "/en/churn", "/en/system"];

for (const path of DASHBOARD) {
  test(`signed out, ${path} redirects to sign-in without the dashboard`, async ({ page }) => {
    const documents: Response[] = [];
    page.on("response", (r) => {
      if (r.request().resourceType() === "document") documents.push(r);
    });

    await page.goto(path);
    await expect(page).toHaveURL(SIGN_IN);
    await expect(page.locator(SHELL)).toHaveCount(0);

    // Also the raw HTML: a streamed page must not ship the shell before it redirects.
    for (const r of documents) {
      if (r.status() >= 300 && r.status() < 400) continue;
      expect(await r.text(), r.url()).not.toContain('data-slot="sidebar');
    }
  });
}

test("the sign-in page renders", async ({ page }) => {
  const res = await page.goto("/en/sign-in");
  expect(res?.ok()).toBe(true);
  await expect(page.locator("main#main")).toBeVisible();
  await expect(page.locator(SHELL)).toHaveCount(0);
  if (clerkConfigured) {
    await expect(page.locator('input[name="identifier"]')).toBeVisible();
  } else {
    await expect(page.getByText(messages.admin.authNotConfigured)).toBeVisible();
  }
});

test.describe("CSP-report sink", () => {
  const violation = JSON.stringify([
    {
      type: "csp-violation",
      body: {
        effectiveDirective: "img-src",
        documentURL: "http://localhost/en/sign-in",
        blockedURL: "https://evil.example/a.png",
        disposition: "enforce",
      },
    },
  ]);

  test("accepts an anonymous report with 204 and an empty body", async ({ request }) => {
    const res = await request.post("/api/csp-report", {
      headers: { "content-type": "application/reports+json" },
      data: violation,
    });
    expect(res.status()).toBe(204);
    expect(await res.text()).toBe("");
  });

  test("refuses a non-CSP content-type with 415", async ({ request }) => {
    const res = await request.post("/api/csp-report", {
      headers: { "content-type": "text/plain" },
      data: violation,
    });
    expect(res.status()).toBe(415);
  });

  test("refuses an oversize body with 413", async ({ request }) => {
    const res = await request.post("/api/csp-report", {
      headers: { "content-type": "application/reports+json" },
      data: "x".repeat(70_000),
    });
    expect(res.status()).toBe(413);
  });
});

test("the session logger refuses a signed-out caller", async ({ request }) => {
  const res = await request.post("/api/session-log", { data: { surface: "admin" } });
  expect(res.ok()).toBe(false);
  if (clerkConfigured) expect(res.status()).toBe(401);
});
