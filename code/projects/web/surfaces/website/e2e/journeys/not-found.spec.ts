import { expect, test } from "@playwright/test";

/**
 * Unknown route → a real 404 rendered inside the app chrome. Deterministic:
 * NotFoundContent uses message-file fallback copy.
 */
test("unknown route returns 404 and renders the not-found page", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("main")).toBeVisible();
});
