import { expect, test } from "@playwright/test";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";

/**
 * An unknown route answers 404 with the branded page: the `[locale]/[...rest]` catch-all calls
 * `notFound()`, which renders `[locale]/not-found` (no Suspense boundary above it, so the
 * response is not streamed and keeps the 404 status). With Clerk keys set, a signed-out
 * visitor bounces to /sign-in first (the proxy gate, by design) — so sign in, like
 * sign-in.spec.ts, before asking for the unknown route.
 */
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const TEST_EMAIL = process.env.E2E_CLERK_TEST_EMAIL ?? "e2e+clerk_test@example.com";

test("unknown route returns the branded 404", async ({ page }) => {
  if (clerkConfigured) {
    await setupClerkTestingToken({ page });
    await page.goto("/en");
    await clerk.signIn({
      page,
      signInParams: { strategy: "email_code", identifier: TEST_EMAIL },
    });
  }

  const res = await page.goto("/en/__does-not-exist__");
  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
});
