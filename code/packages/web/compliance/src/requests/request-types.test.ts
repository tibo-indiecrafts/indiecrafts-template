import { describe, expect, it } from "vitest";
import { requestTypeLabel } from "./request-types";

describe("requestTypeLabel", () => {
  it("follows the locale, English for a locale without labels", () => {
    expect(requestTypeLabel("erasure", "fr")).toBe("Effacement");
    expect(requestTypeLabel("erasure", "en")).toBe("Erasure");
    expect(requestTypeLabel("erasure", "de")).toBe("Erasure");
  });
});
