import { expect, test } from "@playwright/test";
import en from "../../messages/en.json";

const copy = en.pages.newsletterConfirm;

/**
 * Newsletter double opt-in, client side. The routes are stubbed (like the waitlist
 * journey), so no email is sent and nothing reaches Resend: the signed token, its expiry and
 * the api call are unit-tested in `@indiecrafts/modules-web-newsletter`. These prove the UI:
 * the block's consent gate + success state, and the confirm page — the token comes from the
 * URL fragment, a tap POSTs it (never a GET, so a mail scanner can't confirm), with each outcome.
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

const outcomes = [
  { outcome: "confirmed", status: 200, heading: copy.confirmedHeading },
  { outcome: "invalid", status: 200, heading: copy.invalidHeading },
  { outcome: "error", status: 502, heading: copy.errorHeading },
] as const;

for (const { outcome, status, heading } of outcomes) {
  test(`the confirm page POSTs the token on a tap — ${outcome}`, async ({ page }) => {
    let method = "";
    let body: unknown = null;
    await page.route("**/api/newsletter/confirm", async (route) => {
      method = route.request().method();
      body = route.request().postDataJSON();
      await route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify({ status: outcome }),
      });
    });

    // The token rides in the fragment: it never reaches a server, and the page drops it.
    await page.goto("/newsletter/confirm#t=tok-123");
    await expect(page).not.toHaveURL(/#t=/);
    expect(method).toBe(""); // opening the link confirms nothing
    await page.getByRole("button", { name: copy.button }).click();

    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    expect(method).toBe("POST");
    expect(body).toEqual({ token: "tok-123" });
    // A failed save keeps the button, so the visitor can try again.
    if (outcome === "error")
      await expect(page.getByRole("button", { name: copy.button })).toBeEnabled();
  });
}

test("a confirm link without a token is invalid at once", async ({ page }) => {
  await page.goto("/newsletter/confirm");
  await expect(page.getByRole("heading", { name: copy.invalidHeading })).toBeVisible();
});
