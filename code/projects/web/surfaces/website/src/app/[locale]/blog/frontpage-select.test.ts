import { describe, it, expect } from "vitest";
import { pickFrontpage } from "./frontpage-select";

describe("pickFrontpage", () => {
  it("uses modules when present", () => {
    expect(pickFrontpage([{ _type: "module.blog-hero", _key: "a" }] as never)).toBe(
      "modules",
    );
  });

  it("falls back to default when empty/undefined", () => {
    expect(pickFrontpage([])).toBe("default");
    expect(pickFrontpage(undefined)).toBe("default");
  });
});
