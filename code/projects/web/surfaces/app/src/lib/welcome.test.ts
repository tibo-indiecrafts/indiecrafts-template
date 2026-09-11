import { describe, expect, it } from "vitest";
import { pickWelcome } from "./welcome";

describe("pickWelcome", () => {
  it("prefers the web section over shared for the locale", () => {
    expect(
      pickWelcome({ web: { en: "Web" }, shared: { en: "Shared" } }, "en"),
    ).toBe("Web");
  });

  it("falls back to shared when web has no line for the locale", () => {
    expect(
      pickWelcome({ web: { fr: "Web FR" }, shared: { en: "Shared" } }, "en"),
    ).toBe("Shared");
  });

  it("resolves the requested locale, not another", () => {
    expect(
      pickWelcome({ web: { en: "EN", fr: "FR" }, shared: {} }, "fr"),
    ).toBe("FR");
  });

  it("returns null when neither section has the locale", () => {
    expect(
      pickWelcome({ web: { fr: "x" }, shared: { fr: "y" } }, "en"),
    ).toBeNull();
  });

  it("returns null for empty or missing data", () => {
    expect(pickWelcome(null, "en")).toBeNull();
    expect(pickWelcome({}, "en")).toBeNull();
  });
});
