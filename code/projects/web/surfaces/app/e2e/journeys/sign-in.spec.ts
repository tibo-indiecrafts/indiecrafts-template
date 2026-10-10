import { expect, test } from "@playwright/test";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { throwawayClerkUser } from "@indiecrafts/packages-web-auth/testing/clerk-user";

/**
 * App auth journey — mirrors the website's. Clerk **Testing Tokens** + a `+clerk_test`
 * identity (no real user/creds); asserts the session at the framework level
 * (`window.Clerk.user`), not app DOM. SKIPS unless the Clerk keys are wired (so CI stays
 * green until they are). Setup → `docs/projects/web/website/setup/testing.md` § Auth E2E.
 */
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
// Clerk signs in existing users only: each run creates its own and removes it.
const user = throwawayClerkUser("app-sign-in");

async function isSignedIn(page: import("@playwright/test").Page): Promise<boolean> {
  return page.evaluate(() =>
    Boolean((window as unknown as { Clerk?: { user?: unknown } }).Clerk?.user),
  );
}

test.describe("app auth (Clerk sign-in)", () => {
  test.skip(!clerkConfigured, "no Clerk instance wired for e2e — set the test keys");
  test.beforeAll(user.create);
  test.afterAll(user.remove);

  test("sign-in establishes a session; sign-out clears it", async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto("/en");

    await clerk.signIn({
      page,
      signInParams: { strategy: "email_code", identifier: user.email },
    });
    expect(await isSignedIn(page)).toBe(true);

    // The gated account route is reachable while signed in (no bounce to /sign-in).
    await page.goto("/en/account");
    await expect(page).not.toHaveURL(/\/sign-in/);

    await clerk.signOut({ page });
    await page.goto("/en");
    expect(await isSignedIn(page)).toBe(false);
  });
});
