import { expect, test } from "@playwright/test";

/**
 * `/account` (data export + account delete) for a signed-out visitor — the only part
 * reachable without signing in. The page 404s unless Clerk AND `NEXT_PUBLIC_API_URL`
 * are configured; with both, a signed-out visitor is redirected home. Either way the
 * account controls never render. The signed-in path is in `sign-in.spec.ts` (runs when
 * the Clerk test keys are set).
 */
test("a signed-out visitor never reaches the account controls", async ({ page }) => {
  const res = await page.goto("/account");
  if (res?.status() !== 404) {
    expect(new URL(page.url()).pathname).toBe("/"); // redirected home
  }
  // Clerk's <UserProfile> (where export + delete live) never mounts.
  await expect(page.locator(".cl-userProfile-root")).toHaveCount(0);
});
