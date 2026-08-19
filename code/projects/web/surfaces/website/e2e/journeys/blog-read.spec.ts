import { expect, test } from "@playwright/test";

/**
 * Blog read journey — index → a post → its markdown export. Needs ≥1 seeded
 * published post (the seeder creates several).
 */
test("open a post from the blog index", async ({ page }) => {
  await page.goto("/blog");
  const card = page.getByRole("article").first();
  await expect(card).toBeVisible();
  await card.getByRole("link").first().click();

  await expect(page).toHaveURL(/\/blog\/[^/]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the post markdown export is served", async ({ page, request }) => {
  await page.goto("/blog");
  const href = await page
    .getByRole("article")
    .first()
    .getByRole("link")
    .first()
    .getAttribute("href");
  expect(href).toBeTruthy();

  const res = await request.get(`${href}/md`);
  expect(res.ok()).toBeTruthy();
  expect(res.headers()["content-type"]).toContain("text/markdown");
});
