import { describe, expect, it } from "vitest";
import { pages } from "./pages";

describe("pages — crawl surface", () => {
  // A signed-in, per-user page: never in search. `noindex` also drops it from the sitemap
  // and the LLM endpoints (`isLlmsPage`), both of which filter on it.
  it("keeps /account out of search", () => {
    expect(pages.account.seo?.noindex).toBe(true);
  });
});
