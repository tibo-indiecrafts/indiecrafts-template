import { describe, expect, it } from "vitest";
import { AI_TRAINING_USER_AGENTS } from "@/config";
import { robotsTxt } from "./route";

const BOTS = ["GPTBot", "Google-Extended", "CCBot"] as const;
const base = {
  aiTrainingBots: BOTS,
  siteUrl: "https://x.dev",
  sitemap: true,
  llmsIndex: true,
} as const;

describe("robotsTxt", () => {
  it("blocks each AI-training bot but keeps `*` allowed when indexable + blockAiTraining", () => {
    const txt = robotsTxt({ ...base, indexable: true, blockAiTraining: true });
    // Each training bot gets its own Disallow group.
    for (const bot of BOTS) expect(txt).toContain(`User-agent: ${bot}\nDisallow: /`);
    // The catch-all group still allows everything else (search + AI-search bots).
    expect(txt).toContain("User-agent: *\nAllow: /");
    // Search bots are never named → they fall through to `*` and keep indexing.
    expect(txt).not.toContain("User-agent: Googlebot");
    expect(txt).not.toContain("User-agent: Bingbot");
    expect(txt).not.toContain("User-agent: PerplexityBot");
    // Standard directives preserved.
    expect(txt).toContain("Sitemap: https://x.dev/sitemap.xml");
    expect(txt).toContain("# llms.txt: https://x.dev/llms.txt");
  });

  it("never blocks the assets crawlers need to render a page", () => {
    // Google fetches /_next/ CSS, JS and images to render; blocking them harms indexing.
    const txt = robotsTxt({ ...base, indexable: true, blockAiTraining: true });
    expect(txt).not.toMatch(/Disallow: \/_next/);
    expect(txt).toContain("Disallow: /api/");
  });

  it("emits no obsolete `Host:` directive (Google ignores it; Yandex dropped it in 2018)", () => {
    const txt = robotsTxt({ ...base, indexable: true, blockAiTraining: true });
    expect(txt).not.toContain("Host:");
  });

  it("omits the AI groups when blockAiTraining is off", () => {
    const txt = robotsTxt({ ...base, indexable: true, blockAiTraining: false });
    for (const bot of BOTS) expect(txt).not.toContain(bot);
    expect(txt).toContain("User-agent: *\nAllow: /");
  });

  it("non-indexable → full Disallow, no AI groups", () => {
    const txt = robotsTxt({ ...base, indexable: false, blockAiTraining: true });
    expect(txt).toBe("User-agent: *\nDisallow: /\n");
  });

  it("drops sitemap/llms lines when their flags are off", () => {
    const txt = robotsTxt({
      ...base,
      indexable: true,
      blockAiTraining: false,
      sitemap: false,
      llmsIndex: false,
    });
    expect(txt).not.toContain("Sitemap:");
    expect(txt).not.toContain("# llms.txt:");
  });
});

describe("AI_TRAINING_USER_AGENTS", () => {
  // Blocking one of these would drop the site from a search engine or from AI answers.
  it.each([
    "Googlebot",
    "Bingbot",
    "Applebot",
    "DuckDuckBot",
    "PetalBot", // Huawei Petal Search
    "OAI-SearchBot",
    "ChatGPT-User",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Amzn-SearchBot",
  ])("never lists the search / user-fetch crawler %s", (bot) => {
    expect(AI_TRAINING_USER_AGENTS).not.toContain(bot);
  });

  it.each(["GPTBot", "ClaudeBot", "CCBot", "PanguBot", "FacebookBot", "AI2Bot"])(
    "lists the training crawler %s",
    (bot) => {
      expect(AI_TRAINING_USER_AGENTS).toContain(bot);
    },
  );
});
