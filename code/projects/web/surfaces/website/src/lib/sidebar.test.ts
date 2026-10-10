import { describe, expect, it, vi } from "vitest";

vi.mock("@indiecrafts/packages-web-sanity/client", () => ({
  client: { fetch: vi.fn() },
}));
vi.mock("@/config", () => ({ features: { blog: true } }));

const { pageSidebar } = await import("./sidebar");

const card = (_type: string) => ({ _type, _key: _type }) as never;
const settings = {
  default: [card("module.blog-toc"), card("module.blog-related"), card("module.callout")],
};

describe("pageSidebar", () => {
  it("keeps the post's own cards on a post", () => {
    expect(
      pageSidebar("post", settings).map((c) => (c as { _type: string })._type),
    ).toEqual(["module.blog-toc", "module.blog-related", "module.callout"]);
  });

  it("drops the post's own cards anywhere else, so no empty column is left", () => {
    for (const page of ["home", "page", "blogIndex", "blogListing"] as const) {
      expect(
        pageSidebar(page, settings).map((c) => (c as { _type: string })._type),
      ).toEqual(["module.callout"]);
    }
  });

  it("follows the document's own choice first", () => {
    expect(pageSidebar("page", settings, { mode: "none" })).toEqual([]);
  });
});
