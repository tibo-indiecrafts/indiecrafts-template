import { expect, test } from "@playwright/test";

/**
 * Theme toggle — pick Dark, assert `<html>` flips, and that the choice persists
 * across a reload (next-themes stores it). Deterministic: message-file labels.
 */
test("dark theme applies and persists", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Switch theme" }).click();
  await page.getByRole("menuitemradio", { name: /dark/i }).click();

  const html = page.locator("html");
  await expect(html).toHaveClass(/dark/);

  await page.reload();
  await expect(html).toHaveClass(/dark/);
});
