import { describe, it, expect } from "vitest";
import { NAV, activeKey } from "./nav";

describe("admin nav", () => {
  it("has every page exactly once", () => {
    const keys = NAV.flatMap((g) => g.items.map((i) => i.key));
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain("overview");
  });
  it("matches the active item by pathname (longest prefix, ignoring locale)", () => {
    expect(activeKey("/en/sessions")).toBe("sessions");
    expect(activeKey("/data-requests")).toBe("dataRequests");
    expect(activeKey("/en")).toBe("overview");
    expect(activeKey("/fr")).toBe("overview");
  });
});
