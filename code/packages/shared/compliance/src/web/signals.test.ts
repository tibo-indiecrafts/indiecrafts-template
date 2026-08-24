import { afterEach, describe, expect, it, vi } from "vitest";
import { signalsDeny } from "./signals";

describe("signalsDeny", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("denies when the server-detected Sec-GPC signal is true, even with no client signal", () => {
    vi.stubGlobal("navigator", {
      globalPrivacyControl: false,
      doNotTrack: "0",
    });
    expect(signalsDeny(true)).toBe(true);
  });

  it("falls back to the client browser signal when the server signal is false", () => {
    vi.stubGlobal("navigator", { globalPrivacyControl: true, doNotTrack: "0" });
    expect(signalsDeny(false)).toBe(true);
  });

  it("denies nothing when neither the server nor the client signals opt-out", () => {
    vi.stubGlobal("navigator", {
      globalPrivacyControl: false,
      doNotTrack: "0",
    });
    expect(signalsDeny(false)).toBe(false);
  });
});
