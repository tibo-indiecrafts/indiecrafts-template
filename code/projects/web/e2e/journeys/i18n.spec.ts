import { expect, test } from "@playwright/test";

/**
 * Locale switch — pick French, assert the URL gains the `/fr` prefix and
 * `<html lang>` flips. Chrome copy is deterministic (message files); the
 * LocaleSwitcher radio items are labelled by locale name.
 */
test("switching to French updates the URL and html lang", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Change language" }).click();
  await page.getByRole("menuitemradio", { name: /fran|français|fr/i }).click();

  await expect(page).toHaveURL(/\/fr(\/|$|\?)/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});
