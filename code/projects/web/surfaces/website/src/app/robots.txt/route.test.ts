import { describe, expect, it } from "vitest";
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
    expect(txt).toContain("Host: https://x.dev");
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
    expect(txt).toContain("Host: https://x.dev");
  });
});
