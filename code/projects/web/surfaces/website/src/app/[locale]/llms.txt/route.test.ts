import { describe, expect, it, vi } from "vitest";
import { site } from "@/config";
import en from "../../../../messages/en.json";
import fr from "../../../../messages/fr.json";

// The route's own text (headings, labels, the language links) follows the URL locale;
// the editorial copy comes from Sanity (stubbed here). Real message files, so a missing
// key in either locale fails.
const MESSAGES = { en, fr } as const;
vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: "en" | "fr";
    namespace: string;
  }) => {
    const ns = namespace
      .split(".")
      .reduce<Record<string, unknown>>(
        (o, k) => o[k] as Record<string, unknown>,
        MESSAGES[locale],
      );
    return (key: string, values: Record<string, string> = {}) =>
      (ns[key] as string).replace(/\{(\w+)\}/g, (_, v: string) => values[v] ?? "");
  },
}));
vi.mock("@/app/routes", () => ({ ROUTES: [] }));
vi.mock("@/i18n/routing", () => ({ getStaticPathname: () => "/" }));
vi.mock("@/lib/seo/page-markdown", () => ({ isLlmsPage: () => true }));
vi.mock("@indiecrafts/modules-web-blog/lib/llms", () => ({
  getBlogLlmsLines: async () => [],
  getTaxonomyLlmsLines: async () => [],
}));
vi.mock("@/lib/seo/site-seo", () => ({
  DEFAULT_SITE_NAME: "Site",
  getPageSeo: async () => undefined,
  getSiteSettings: async () => ({ siteName: "Site" }),
  getSiteSeo: async () => ({
    tagline: "Tagline",
    description: "Description",
    llms: {
      reviewedAt: "2026-09-01",
      resources: [{ name: "Docs", href: "https://docs.x" }],
    },
  }),
}));

const { GET } = await import("./route");
const read = async (locale: string) =>
  (
    await GET(new Request("https://x/llms.txt"), { params: Promise.resolve({ locale }) })
  ).text();

describe("/llms.txt", () => {
  it("writes its own labels in the URL locale", async () => {
    const txt = await read("fr");
    expect(txt).toContain(`${fr.llms.lastReviewed.replace("{date}", "2026-09-01")}`);
    expect(txt).toContain(`## ${fr.llms.resources}`);
    expect(txt).not.toContain(`## ${en.llms.resources}\n`);
  });

  it("links every other locale's llms.txt so crawlers find the translations", async () => {
    expect(await read("en")).toContain(`[Français](${site.url}/fr/llms.txt)`);
    const frTxt = await read("fr");
    expect(frTxt).toContain(`[English](${site.url}/llms.txt)`);
    expect(frTxt).not.toContain(`[Français](`);
  });
});
