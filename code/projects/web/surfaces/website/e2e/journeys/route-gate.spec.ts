import { expect, test } from "@playwright/test";

/**
 * Route-gate — a feature that ships OFF by default must 404 in a real browser,
 * proving the flag∧page.enabled gate. `terms-of-sale` (CGV) is off by default
 * (`features.legal.sales`), so it needs no flag-off rebuild to assert.
 */
test("a default-off feature route returns 404", async ({ page }) => {
  const res = await page.goto("/terms-of-sale");
  expect(res?.status()).toBe(404);
});
