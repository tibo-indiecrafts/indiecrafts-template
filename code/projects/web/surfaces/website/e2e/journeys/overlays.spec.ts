import { expect, test, type Page } from "@playwright/test";

/**
 * Overlays take turns (`useOverlayTurn`): at most one fixed overlay on screen, the cookie
 * banner first. Needs the seeded `siteSettings.analytics.requireCookieConsent` on (the
 * banner mounts) — the same precondition as `consent.spec.ts`.
 */

const banner = '[aria-labelledby="cookie-banner-title"]';

/** Visible fixed overlays: the cookie banner, the legal banner, prompts, the announcement card. */
const visibleOverlays = (page: Page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("dialog[open], [role=status], [role=dialog]")].filter(
        (el) =>
          !el.closest("[data-sonner-toaster]") &&
          getComputedStyle(el).position === "fixed" &&
          el.getBoundingClientRect().height > 0,
      ).length,
  );

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
]) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test("one overlay at a time, the cookie banner first", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator(banner)).toBeVisible();
      expect(await visibleOverlays(page)).toBe(1);

      await page.locator(banner).getByRole("button", { name: "Accept all" }).click();
      await expect(page.locator(banner)).toBeHidden();
      // The next overlay in line (legal banner, then promotions) may take the turn —
      // never two at once.
      await page.waitForTimeout(500);
      expect(await visibleOverlays(page)).toBeLessThanOrEqual(1);
    });
  });
}
