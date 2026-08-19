import { expect, test } from "@playwright/test";

/**
 * Waitlist happy-path submit. The `/api/waitlist` POST is stubbed → 201, so no
 * Sanity write happens; the test proves the client flow (consent gate → submit →
 * success message). Turnstile is off (template default), so email + consent alone
 * enable the button. Needs the `/waitlist` page live (features.waitlist +
 * seeded `waitlistSettings.enabled`).
 */
test("join the waitlist shows the success message", async ({ page }) => {
  await page.route("**/api/waitlist", (route) =>
    route.fulfill({ status: 201, contentType: "application/json", body: "{}" }),
  );

  await page.goto("/waitlist");

  const form = page.locator("form", { has: page.locator('input[type="email"]') });
  await expect(form).toBeVisible();

  const submit = form.getByRole("button");
  await expect(submit).toBeDisabled(); // consent gate

  await form.locator('input[type="email"]').fill("e2e@example.com");
  await form.getByRole("checkbox").check();
  await expect(submit).toBeEnabled();

  await submit.click();
  await expect(page.getByRole("status")).toBeVisible();
});
