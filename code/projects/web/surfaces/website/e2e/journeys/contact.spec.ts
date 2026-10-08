import { expect, test, type Page } from "@playwright/test";

/**
 * Contact page, client side. `/api/contact` is stubbed, so nothing is written to Sanity
 * and no email leaves; the engine's validation is unit-tested in
 * `@indiecrafts/modules-web-contact` and the route's boundary in
 * `src/app/api/contact/route.test.ts`. This proves the form: the consent gate, the
 * required fields, the success state, and the error state. Copy comes from the seeded
 * `contactSettings` (Sanity), so the checks use roles, not strings. Needs `/contact`
 * live (`features.contact` + seeded `contactSettings.enabled`).
 */
async function openForm(page: Page, status: number) {
  const posts: Record<string, unknown>[] = [];
  await page.route("**/api/contact", async (route) => {
    posts.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({
      status,
      contentType: "application/json",
      body: status === 201 ? '{"ok":true}' : '{"error":"server"}',
    });
  });
  await page.goto("/contact");
  // The textarea singles out the contact form (a footer sign-up may also hold an email field).
  const form = page.locator("form", { has: page.locator("textarea") });
  await expect(form).toBeVisible();
  return { form, posts, submit: form.getByRole("button") };
}

test("the contact form sends after consent and shows the success message", async ({
  page,
}) => {
  const { form, posts, submit } = await openForm(page, 201);
  await expect(submit).toBeDisabled(); // consent gate

  // Consent alone is not enough: the browser blocks the empty required fields.
  await form.getByRole("checkbox").check();
  await expect(submit).toBeEnabled();
  await submit.click();
  expect(posts).toHaveLength(0);

  await form.locator('input[type="email"]').fill("e2e@example.com");
  await form.locator("textarea").fill("Hello from the e2e journey.");
  await submit.click();

  await expect(page.getByRole("status").filter({ hasText: /\S/ }).first()).toBeVisible();
  await expect(form).toBeHidden();
  expect(posts).toHaveLength(1);
  expect(posts[0]).toMatchObject({
    email: "e2e@example.com",
    message: "Hello from the e2e journey.",
    consent: true,
    honeypot: "",
  });
  expect(typeof posts[0]?.startedAt).toBe("number");
});

test("a failed send shows the error and keeps the message", async ({ page }) => {
  const { form, submit } = await openForm(page, 500);
  await form.locator('input[type="email"]').fill("e2e@example.com");
  await form.locator("textarea").fill("Hello from the e2e journey.");
  await form.getByRole("checkbox").check();
  await submit.click();

  await expect(form.getByRole("alert")).toBeVisible();
  await expect(form.locator("textarea")).toHaveValue("Hello from the e2e journey.");
});
