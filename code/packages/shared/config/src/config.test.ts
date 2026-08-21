import { describe, expect, it } from "vitest";
import { isPageVisible, locales, site } from "./index";

// The config brick is the shared primitives + the generic page-config contract.
// (App-owned instance config — `features` / `pages` / `theme` / `fonts` — lives in
// the app at `apps/web/src/config`; its shape is guarded by `as const satisfies`
// there + the blog route-gate test.) These guard what the package still owns.
describe("@indiecrafts/packages-shared-config", () => {
  it("has a site url and at least one locale", () => {
    expect(site.url).toMatch(/^https?:\/\//);
    expect(locales.length).toBeGreaterThan(0);
  });

  it("isPageVisible defaults to visible and honours an explicit false", () => {
    expect(isPageVisible({ key: "/", id: "home", slug: "/" })).toBe(true);
    expect(
      isPageVisible({ key: "/x", id: "x", slug: "/x", enabled: false }),
    ).toBe(false);
  });
});
