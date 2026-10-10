import { expect, test, type Page } from "@playwright/test";

/**
 * Page-builder journeys over the seeded `tests-e2e` dataset: the home page promotes the
 * blog with its "Articles à la une" block, and an article shows its sidebar cards (Site
 * web → Barre latérale seeds articles with the TOC + related posts). Checked at a phone
 * and a desktop width: no horizontal scroll, the cards beside the body on desktop and
 * after it on a phone (DOM order = reading order).
 */

const POST = "/blog/fast-prototyping-with-nextjs";
const sidebar = (page: Page) =>
  page.getByRole("complementary", { name: "Related links" });

const noHorizontalScroll = async (page: Page) =>
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);

test("the home page promotes the blog with a featured block", async ({ page }) => {
  await page.goto("/");
  const featured = page.locator("#home-featured");
  await expect(featured.getByRole("heading", { level: 2 })).toBeVisible();
  // A link to a post (not only the "All articles" link to the blog).
  await expect(featured.locator('a[href*="/blog/"]').first()).toBeVisible();
  await noHorizontalScroll(page);
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("an article shows its TOC and related cards beside the body", async ({ page }) => {
    await page.goto(POST);
    const aside = sidebar(page);
    await expect(aside.getByRole("navigation", { name: "On this page" })).toBeVisible();
    await expect(aside.getByRole("region", { name: /^More on / })).toBeVisible();
    // Beside the body: the sidebar starts right of the article text.
    const body = await page.locator(".prose").first().boundingBox();
    const side = await aside.boundingBox();
    expect(side!.x).toBeGreaterThan(body!.x + body!.width);
    // The phone's TOC button stays hidden.
    await expect(
      page.locator("details").filter({ hasText: "On this page" }),
    ).toBeHidden();
    await noHorizontalScroll(page);
  });

  test("a site page with no sidebar setting stays full width", async ({ page }) => {
    await page.goto("/blog");
    await expect(sidebar(page)).toHaveCount(0);
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("an article opens its TOC above the body and lists related posts after it", async ({
    page,
  }) => {
    await page.goto(POST);
    await expect(
      page.locator("details").filter({ hasText: "On this page" }),
    ).toBeVisible();
    const aside = sidebar(page);
    // The TOC card is a desktop card; the related card follows the article.
    await expect(aside.getByRole("navigation", { name: "On this page" })).toBeHidden();
    await expect(aside.getByRole("region", { name: /^More on / })).toBeVisible();
    const body = await page.locator(".prose").first().boundingBox();
    const side = await aside.boundingBox();
    expect(side!.y).toBeGreaterThan(body!.y + body!.height);
    await noHorizontalScroll(page);
  });
});
