import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases, strips diacritics, and hyphen-joins", () => {
    expect(slugify("Héllo Wörld!")).toBe("hello-world");
    expect(slugify("  Trim  &  Collapse  ")).toBe("trim-collapse");
  });

  it("drops leading/trailing hyphens and non-alphanumerics", () => {
    expect(slugify("--Already-Slug--")).toBe("already-slug");
    expect(slugify("C++ & Rust?")).toBe("c-rust");
  });

  it("is deterministic and caps length at 80 chars", () => {
    const long = "word ".repeat(40);
    expect(slugify(long)).toBe(slugify(long));
    expect(slugify(long).length).toBeLessThanOrEqual(80);
  });
});
