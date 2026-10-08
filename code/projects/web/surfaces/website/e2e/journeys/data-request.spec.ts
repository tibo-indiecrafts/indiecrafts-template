import { expect, test, type Page } from "@playwright/test";
import en from "../../messages/en.json";

const copy = en.legal.dataRequest;

/**
 * GDPR data-subject request (`/data-request`), client side. `/api/data-request` is
 * stubbed, so nothing reaches the api's `data_requests` table and no alert is sent;
 * the route's boundary is unit-tested in `src/app/api/data-request/route.test.ts`.
 * This proves the form: a right AND consent are required, then the success or error state.
 */
async function openForm(page: Page, status: number) {
  const posts: Record<string, unknown>[] = [];
  await page.route("**/api/data-request", async (route) => {
    posts.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({
      status,
      contentType: "application/json",
      body: status === 201 ? '{"ok":true}' : '{"error":"server"}',
    });
  });
  await page.goto("/data-request");
  await expect(page.getByRole("heading", { level: 1, name: copy.heading })).toBeVisible();
  return { posts, submit: page.getByRole("button", { name: copy.submit }) };
}

test("a data request needs a right and consent, then confirms receipt", async ({
  page,
}) => {
  const { posts, submit } = await openForm(page, 201);
  await expect(submit).toBeDisabled();

  await page.getByLabel(copy.emailLabel).fill("e2e@example.com");
  await page.getByRole("checkbox", { name: copy.consent }).check();
  await expect(submit).toBeDisabled(); // no right chosen yet

  await page.getByRole("radio", { name: copy.types.access }).click();
  await expect(submit).toBeEnabled();
  await submit.click();

  // Sanity `uiMessages` may overlay the JSON copy, so assert the state, not the words.
  await expect(page.getByRole("status")).toBeVisible();
  await expect(submit).toBeHidden();
  expect(posts).toHaveLength(1);
  expect(posts[0]).toMatchObject({
    email: "e2e@example.com",
    requestType: "access",
    consent: true,
    language: "en",
  });
});

test("a failed data request shows the error and keeps the form", async ({ page }) => {
  const { submit } = await openForm(page, 500);
  await page.getByRole("radio", { name: copy.types.erasure }).click();
  await page.getByLabel(copy.emailLabel).fill("e2e@example.com");
  await page.getByRole("checkbox", { name: copy.consent }).check();
  await submit.click();

  // Scoped by text: Next's route announcer is also a role="alert".
  await expect(page.getByRole("alert").filter({ hasText: copy.error })).toBeVisible();
  await expect(submit).toBeVisible();
});
