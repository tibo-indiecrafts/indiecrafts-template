import { expect, test } from "@playwright/test";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { throwawayClerkUser } from "@indiecrafts/packages-web-auth/testing/clerk-user";
import messages from "../../messages/en.json";

/**
 * Admin signed-in journeys — mirror the website's auth journey: Clerk **Testing Tokens** + a
 * `+clerk_test` identity (a Clerk dev/test instance accepts the code `424242`), so no real
 * user or credentials exist. SKIPS unless the Clerk test keys are wired
 * (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`).
 *
 *  • non-admin — a throwaway test user with no role: the gate still sends it to sign-in,
 *    which offers a way out (sign out) instead of the dashboard.
 *  • admin — also needs `E2E_CLERK_ADMIN_EMAIL`: a test user with `publicMetadata.role =
 *    "admin"`, on an instance whose session token carries `metadata` (the claim `isAdmin` reads).
 */
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
// The non-admin: a fresh user per run (Clerk signs in existing users only), removed after.
const user = throwawayClerkUser("admin-non-admin");
const ADMIN_EMAIL = process.env.E2E_CLERK_ADMIN_EMAIL;
const SHELL = '[data-slot^="sidebar"]';

async function signIn(page: import("@playwright/test").Page, identifier: string) {
  await setupClerkTestingToken({ page });
  await page.goto("/en/sign-in");
  await clerk.signIn({ page, signInParams: { strategy: "email_code", identifier } });
}

test.describe("admin auth (Clerk sign-in)", () => {
  test.skip(!clerkConfigured, "no Clerk instance wired for e2e — set the test keys");
  test.beforeAll(user.create);
  test.afterAll(user.remove);

  test("a signed-in non-admin is kept out of the dashboard", async ({ page }) => {
    await signIn(page, user.email);
    await page.goto("/en/sessions");
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.getByText(messages.admin.notAdmin)).toBeVisible();
    await expect(page.locator(SHELL)).toHaveCount(0);
    await clerk.signOut({ page });
  });

  test("a signed-in admin reaches the dashboard", async ({ page }) => {
    test.skip(!ADMIN_EMAIL, "set E2E_CLERK_ADMIN_EMAIL to a test user with the admin role");
    await signIn(page, ADMIN_EMAIL!);
    await page.goto("/en/sessions");
    await expect(page).not.toHaveURL(/\/sign-in/);
    await expect(page.locator(SHELL).first()).toBeVisible();
    await expect(
      page.getByRole("heading", { name: messages.admin.sessions.title }),
    ).toBeVisible();
    await clerk.signOut({ page });
  });
});
