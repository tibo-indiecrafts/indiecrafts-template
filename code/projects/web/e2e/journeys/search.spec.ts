import { expect, test } from "@playwright/test";

/**
 * Blog search — a plain GET form (`role="search"`, input `name="q"`), so the URL
 * is shareable and results render server-side. Navigation is deterministic;
 * result rows depend on seeded content. Needs `features.blogSearch`.
 */
test("search renders the results page for a query", async ({ page }) => {
  await page.goto("/blog/search?q=the");
  await expect(page.getByRole("search")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
});

test("the search form submits a query into the URL", async ({ page }) => {
  await page.goto("/blog/search");
  const form = page.getByRole("search");
  await form.locator('input[name="q"]').fill("guide");
  await form.getByRole("button").click();
  await expect(page).toHaveURL(/[?&]q=guide/);
});
