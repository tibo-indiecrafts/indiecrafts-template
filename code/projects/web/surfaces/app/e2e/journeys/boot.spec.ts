import { expect, test } from "@playwright/test";

/**
 * The app boots at `/en`: with no Clerk key it renders the public app shell; with a key set
 * and no session it bounces to `/sign-in`. Either way it's a live 2xx app with real content —
 * never a 5xx or a blank page. So assert a 2xx and that EITHER the app shell (`main`) OR the
 * sign-in form (a textbox) is on screen.
 */
test("the app boots at /en", async ({ page }) => {
  const res = await page.goto("/en");
  expect(res, "no response for /en").toBeTruthy();
  expect(res!.ok()).toBeTruthy(); // 2xx after following any locale/auth redirect
  await expect(
    page.locator("main").or(page.getByRole("textbox")).first(),
  ).toBeVisible();
});
