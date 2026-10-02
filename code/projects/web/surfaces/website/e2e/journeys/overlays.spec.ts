import { expect, test, type Page } from "@playwright/test";

/**
 * Overlays take turns (`useOverlayTurn`): at most one fixed overlay on screen, the cookie
 * banner first, always in the bottom slot — the top belongs to the announcement bar and the
 * confirmation toasts. Needs the seeded `siteSettings.analytics.requireCookieConsent` on (the
 * banner mounts) and the seeded `announcementBar` + `announcementToast` — the same seed as
 * `consent.spec.ts`.
 */

const banner = '[aria-labelledby="cookie-banner-title"]';

/** Visible fixed overlays (cookie banner, legal banner, prompts, the announcement card) — their edges. */
const visibleOverlays = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("dialog[open], [role=status], [role=dialog]")]
      .filter(
        (el) =>
          !el.closest("[data-sonner-toaster]") &&
          getComputedStyle(el).position === "fixed" &&
          el.getBoundingClientRect().height > 0,
      )
      .map((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        return { top, bottom };
      }),
  );

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
]) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });

    test("one overlay at a time, the cookie banner first, in the bottom slot", async ({
      page,
    }) => {
      // Each overlay sits in the bottom slot (`bottom-4`), clear of the top chrome.
      const inBottomSlot = (o: { top: number; bottom: number }) =>
        expect(viewport.height - o.bottom).toBeLessThanOrEqual(32);

      await page.goto("/");
      await expect(page.locator(banner)).toBeVisible();
      const first = await visibleOverlays(page);
      expect(first).toHaveLength(1);
      first.forEach(inBottomSlot);

      await page.locator(banner).getByRole("button", { name: "Accept all" }).click();
      await expect(page.locator(banner)).toBeHidden();

      // Then the legal banner (when versions are pending), then the seeded announcement
      // card — each alone, each at the bottom, never over the announcement bar at the top.
      const legal = page.getByRole("status").filter({ hasText: "Privacy Policy" });
      const card = page.getByRole("status").filter({ hasText: "Meet the new dashboard" });
      await expect(legal.or(card)).toBeVisible();
      if (await legal.isVisible()) {
        const turn = await visibleOverlays(page);
        expect(turn).toHaveLength(1);
        turn.forEach(inBottomSlot);
        await legal.getByRole("button", { name: "Accept" }).click();
      }
      await expect(card).toBeVisible();
      const last = await visibleOverlays(page);
      expect(last).toHaveLength(1);
      last.forEach(inBottomSlot);
    });
  });
}

test("a dismissed announcement bar stays dismissed after a reload", async ({ page }) => {
  await page.goto("/");
  const bar = page.getByRole("region", { name: "Announcement" });
  await expect(bar).toBeVisible();

  await bar.getByRole("button", { name: "Dismiss" }).click();
  await expect(bar).toBeHidden();
  await page.reload();
  await expect(page.locator("main")).toBeVisible();
  await expect(bar).toBeHidden();
});
