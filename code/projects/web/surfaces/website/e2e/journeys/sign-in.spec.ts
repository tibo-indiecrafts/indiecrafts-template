import { expect, test } from "@playwright/test";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";

/**
 * Auth journey — the highest-risk flow every other journey deliberately skips. Uses Clerk
 * **Testing Tokens** (`@clerk/testing`) so bot-detection never blocks the run, and a
 * `+clerk_test` identity (a Clerk dev/test instance accepts the fixed code `424242`), so no
 * real user or credentials exist. `clerk.signIn` drives the REAL Clerk backend + session —
 * stable, it does not depend on the prebuilt `<SignIn>` DOM; a separate test asserts the
 * `<SignIn>` UI actually mounts on `/sign-in`.
 *
 * SKIPS unless the run has a Clerk instance wired — `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (baked
 * into the built app) + `CLERK_SECRET_KEY` (for the Testing Token, in global-setup). So CI
 * stays green until the Clerk test keys are set. Setup → `docs/projects/web/website/setup/testing.md`
 * ("Auth E2E") + the Clerk checklist there.
 */
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
const TEST_EMAIL = process.env.E2E_CLERK_TEST_EMAIL ?? "e2e+clerk_test@example.com";

/** True when Clerk has loaded a signed-in user on the page (framework state, not app DOM). */
async function isSignedIn(page: import("@playwright/test").Page): Promise<boolean> {
  return page.evaluate(() =>
    Boolean((window as unknown as { Clerk?: { user?: unknown } }).Clerk?.user),
  );
}

test.describe("auth (Clerk sign-in)", () => {
  test.skip(!clerkConfigured, "no Clerk instance wired for e2e — set the test keys");

  test("the /sign-in page renders Clerk's form", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/sign-in");
    // Clerk's prebuilt <SignIn> mounts an identifier (email) field.
    await expect(page.locator('input[name="identifier"]')).toBeVisible();
  });

  test("sign-in establishes a session; sign-out clears it", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/");

    await clerk.signIn({
      page,
      signInParams: { strategy: "email_code", identifier: TEST_EMAIL },
    });
    expect(await isSignedIn(page)).toBe(true);

    // A protected route is reachable while signed in (no bounce to /sign-in).
    await page.goto("/account");
    await expect(page).not.toHaveURL(/\/sign-in/);

    await clerk.signOut({ page });
    await page.goto("/");
    expect(await isSignedIn(page)).toBe(false);
  });
});
