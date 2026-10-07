import { describe, expect, it, vi } from "vitest";

describe("configureBlocks", () => {
  // instrumentation.ts and the routes load separate copies of this module.
  it("reaches a second copy of the module", async () => {
    const first = await import("./features");
    first.configureBlocks({
      newsletter: false,
      waitlist: false,
      contact: false,
    });
    vi.resetModules();
    const second = await import("./features");
    expect(second.blockFeatures()).toEqual({
      newsletter: false,
      waitlist: false,
      contact: false,
    });
  });
});
