import { expect, test } from "@playwright/test";

// Visual regression across the whole Storybook: fetch the story index from the
// served `storybook-static`, then screenshot each story's iframe and diff it
// against the committed baseline. Refresh baselines with `pnpm e2e:update`.
//
// Scaling: `LIMIT` caps how many stories run (handy locally / in a first pass).
// Unset it — or set it to 0 — to cover all 127 stories.
const LIMIT = Number(process.env.VISUAL_LIMIT ?? 0);

type StoryEntry = { id: string; type: string; name: string; title: string };

test("every Storybook story matches its visual baseline", async ({ page, baseURL }) => {
  const res = await page.request.get(`${baseURL}/index.json`);
  expect(res.ok(), "storybook-static/index.json served").toBeTruthy();
  const index = (await res.json()) as { entries: Record<string, StoryEntry> };

  let stories = Object.values(index.entries).filter((e) => e.type === "story");
  if (LIMIT > 0) stories = stories.slice(0, LIMIT);
  expect(stories.length).toBeGreaterThan(0);

  for (const story of stories) {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    // Storybook signals a rendered story on the root; fall back to network idle.
    await page.waitForSelector("#storybook-root", { state: "attached" });
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${story.id}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  }
});
