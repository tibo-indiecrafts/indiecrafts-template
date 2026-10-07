import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { STORYBOOK_STATIC } from "./storybook-static";

// Visual regression across the whole Storybook: one test per story, read from the built
// `storybook-static/index.json`, each screenshot diffed against its committed baseline
// (`visual.spec.ts-snapshots/`, linux — CI renders them). One test per story keeps each
// under the default timeout, runs them in parallel, and reports every changed story.
// Refresh baselines with `pnpm e2e:update` (on linux, or from the CI artifact).
//
// `VISUAL_LIMIT` caps how many stories run (handy locally). Unset or 0 = every story.
const LIMIT = Number(process.env.VISUAL_LIMIT ?? 0);

type StoryEntry = { id: string; type: string };

const index = JSON.parse(readFileSync(join(STORYBOOK_STATIC, "index.json"), "utf8")) as {
  entries: Record<string, StoryEntry>;
};
const stories = Object.values(index.entries).filter((e) => e.type === "story");

for (const story of LIMIT > 0 ? stories.slice(0, LIMIT) : stories) {
  test(story.id, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    // Storybook signals a rendered story on the root; then wait for fonts and images.
    await page.waitForSelector("#storybook-root", { state: "attached" });
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot(`${story.id}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
}
