// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const translatedSlugPath = vi.hoisted(() => vi.fn());
vi.mock("@/lib/seo/translations", () => ({ translatedSlugPath }));

const { GET } = await import("./route");
const get = (qs: string) =>
  GET(new NextRequest(`https://x.test/api/i18n/translated-slug${qs}`));

describe("GET /api/i18n/translated-slug", () => {
  it("returns the counterpart path, CDN-cacheable", async () => {
    translatedSlugPath.mockResolvedValueOnce("/en/blog/my-post");
    const res = await get("?type=post&slug=mon-article&from=fr&to=en");
    expect(translatedSlugPath).toHaveBeenCalledWith("post", "mon-article", "fr", "en");
    expect(await res.json()).toEqual({ path: "/en/blog/my-post" });
    expect(res.headers.get("cache-control")).toContain("s-maxage=300");
  });

  it("answers { path: null } for missing params — never a 500", async () => {
    translatedSlugPath.mockResolvedValueOnce(null);
    const res = await get("");
    expect(translatedSlugPath).toHaveBeenLastCalledWith("", "", "", "");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ path: null });
  });
});
