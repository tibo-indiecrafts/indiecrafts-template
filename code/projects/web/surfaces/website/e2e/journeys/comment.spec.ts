import { expect, test } from "@playwright/test";

/**
 * Comment submission on a post. The POST is stubbed → 201 (no Sanity write); the
 * test proves the client shows the "awaiting review" message (comments land
 * unapproved). Needs comments enabled + a seeded post.
 */
test("submitting a comment shows the awaiting-review message", async ({ page }) => {
  await page.route("**/api/comments", (route) =>
    route.fulfill({ status: 201, contentType: "application/json", body: "{}" }),
  );

  await page.goto("/blog");
  await page.getByRole("article").first().getByRole("link").first().click();

  const form = page.locator("form", { has: page.locator("textarea") });
  await expect(form).toBeVisible();

  await form.getByRole("textbox").first().fill("E2E Reviewer"); // author name
  await form.locator("textarea").fill("A thoughtful comment from the e2e suite.");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: /.+/ }).click();

  await expect(page.getByRole("status")).toBeVisible();
});
