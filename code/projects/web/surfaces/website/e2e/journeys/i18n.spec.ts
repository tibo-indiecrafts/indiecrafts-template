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

/**
 * Estimate, then correct — a French browser's first visit lands on `/fr`
 * (Accept-Language). Picking English sticks across a reload (the locale
 * cookie beats the browser), and the "available in Français" strip stays
 * away: the switch answered it.
 */
test.describe("estimated locale", () => {
  test.use({ locale: "fr-FR" });

  test("a French browser lands on /fr and can switch to English for good", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr(\/|$|\?)/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");

    await page.getByRole("button", { name: "Changer de langue" }).click();
    await page.getByRole("menuitemradio", { name: /english/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.goto("/");
    await expect(page).not.toHaveURL(/\/fr(\/|$|\?)/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("region", { name: /Français/ })).toHaveCount(0);
  });
});
