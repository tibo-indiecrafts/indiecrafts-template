import { expect, test } from "@playwright/test";
import en from "../../messages/en.json";

const copy = en.pages.newsletterConfirm;

/**
 * Newsletter double opt-in, client side. The api routes are stubbed (like the waitlist
 * journey), so nothing is written to Sanity: the subscribe engine, the token expiry and
 * the Resend sync are unit-tested in `@indiecrafts/modules-web-newsletter`. These prove the
 * UI: the block's consent gate + success state, and the confirm page — a tap POSTs the
 * token (never a GET, so a mail scanner can't confirm), with both outcomes.
 */
test("the newsletter block subscribes after consent", async ({ page }) => {
  let posted: Record<string, unknown> | null = null;
  await page.route("**/api/newsletter", async (route) => {
    posted = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });

  await page.goto("/");
  const form = page
    .locator("form", { has: page.locator('input[type="email"]') })
    .filter({ has: page.getByRole("checkbox") })
    .first();
  await form.scrollIntoViewIfNeeded();
  const submit = form.getByRole("button");
  await expect(submit).toBeDisabled(); // consent gate

  await form.locator('input[type="email"]').fill("e2e@example.com");
  await form.getByRole("checkbox").check();
  await submit.click();

  // The success message replaces the form.
  await expect(page.getByRole("status").filter({ hasText: /\S/ }).first()).toBeVisible();
  await expect(form).toBeHidden();
  expect(posted).toMatchObject({ email: "e2e@example.com", consent: true });
  // A newsletter block never claims the lead-magnet source (that one carries no newsletter consent).
  expect((posted as Record<string, unknown> | null)?.source).not.toBe("lead-magnet");
});

for (const outcome of ["confirmed", "invalid"] as const) {
  test(`the confirm page POSTs the token on a tap — ${outcome}`, async ({ page }) => {
    let method = "";
    let body: unknown = null;
    await page.route("**/api/newsletter/confirm", async (route) => {
      method = route.request().method();
      body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: outcome }),
      });
    });

    await page.goto("/newsletter/confirm?token=tok-123");
    expect(method).toBe(""); // opening the link confirms nothing
    await page.getByRole("button", { name: copy.button }).click();

    const heading = outcome === "confirmed" ? copy.confirmedHeading : copy.invalidHeading;
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    expect(method).toBe("POST");
    expect(body).toEqual({ token: "tok-123" });
  });
}
