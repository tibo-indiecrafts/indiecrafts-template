import { describe, expect, it } from "vitest";
import { createOrdersErasureAdapter } from "./orders";

// The orders adapter is a registered no-op (no commerce store yet). It must report
// notApplicable, so a GDPR receipt never reads its empty result as a completed erasure.
describe("orders erasure adapter — honest no-op", () => {
  const a = createOrdersErasureAdapter();

  it("marks preview/anonymize/delete notApplicable (not silent empty success)", async () => {
    expect((await a.preview("x@y.z")).notApplicable).toBe(true);
    expect((await a.anonymize("x@y.z")).notApplicable).toBe(true);
    expect((await a.delete("x@y.z")).notApplicable).toBe(true);
  });

  it("still reports no match and no export", async () => {
    expect((await a.findByEmail("x@y.z")).found).toBe(false);
    expect(await a.export("x@y.z")).toBeNull();
  });
});
