import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@indiecrafts/packages-web-sanity/client", () => ({ client: {} }));

const { supportCopy } = await import("./strings");

describe("supportCopy", () => {
  it("copies the support address only when the group opts in and an address is set", () => {
    expect(supportCopy({ copySupport: true }, " help@site.test ")).toEqual([
      "help@site.test",
    ]);
    expect(supportCopy({ copySupport: false }, "help@site.test")).toEqual([]);
    expect(supportCopy({ copySupport: true }, "  ")).toEqual([]);
    expect(supportCopy(null, "help@site.test")).toEqual([]);
  });
});
