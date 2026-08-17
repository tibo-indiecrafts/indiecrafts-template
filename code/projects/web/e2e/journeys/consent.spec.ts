import { expect, test } from "@playwright/test";

/**
 * Cookie-consent flow. Needs the seeded `siteSettings.analytics.requireCookieConsent`
 * on (otherwise the banner never mounts). The banner is a dialog labelled by
 * `#cookie-banner-title`; the preferences dialog is titled "Cookie preferences".
 */

const banner = '[aria-labelledby="cookie-banner-title"]';

test("accepting cookies dismisses the banner and persists across reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(banner)).toBeVisible();

  await page.locator(banner).getByRole("button", { name: "Accept all" }).click();
  await expect(page.locator(banner)).toBeHidden();

  await page.reload();
  await expect(page.locator(banner)).toHaveCount(0); // choice stored → never re-prompts
});

test("?cookies=manage opens the preferences dialog directly", async ({ page }) => {
  await page.goto("/?cookies=manage");
  await expect(page.getByRole("dialog", { name: "Cookie preferences" })).toBeVisible();
});
