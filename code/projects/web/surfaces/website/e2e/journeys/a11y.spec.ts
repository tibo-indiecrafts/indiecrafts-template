import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Accessibility journeys — the keyboard skip-link flow (fully deterministic:
 * message-file copy, no Sanity) and an axe scan of the key pages. Only serious /
 * critical violations fail; minor/moderate are advisory noise on a template.
 */

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab"); // skip link is the first focusable element
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

// The seeded showcase post carries the sidebar (TOC + related cards) and every inline block.
for (const path of ["/", "/blog", "/blog/fast-prototyping-with-nextjs"]) {
  test(`no serious/critical axe violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const blocking = violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(blocking, blocking.map((v) => v.id).join(", ")).toEqual([]);
  });
}
