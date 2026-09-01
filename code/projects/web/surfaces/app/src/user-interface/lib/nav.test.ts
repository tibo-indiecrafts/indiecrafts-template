import { describe, it, expect } from "vitest";
import { NAV, activeKey } from "./nav";

describe("app nav", () => {
  it("has every page exactly once", () => {
    const keys = NAV.map((i) => i.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain("home");
  });
  it("matches the active item by pathname (longest prefix, ignoring locale)", () => {
    expect(activeKey("/en/account")).toBe("account");
    expect(activeKey("/account")).toBe("account");
    expect(activeKey("/en")).toBe("home");
    expect(activeKey("/fr")).toBe("home");
  });
});
