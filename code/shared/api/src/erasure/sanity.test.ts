import { fingerprintEmail } from "@indiecrafts/packages-shared-security/crypto";
import { describe, expect, it, vi } from "vitest";
import { createSanityErasureAdapter, type SanityErasureClient } from "./sanity";

const SALT = "s";
function mockClient(
  docsByType: Record<string, Array<{ _id: string }>>,
): SanityErasureClient {
  return {
    findByEmail: vi.fn(async (type: string) => docsByType[type] ?? []),
    pseudonymise: vi.fn(async () => {}),
  };
}

describe("Sanity erasure adapter", () => {
  it("anonymize pseudonymises waitlistEntry docs to the fingerprint", async () => {
    const c = mockClient({ waitlistEntry: [{ _id: "w1" }] });
    const a = createSanityErasureAdapter(c, SALT);
    const r = await a.anonymize("x@y.com");
    const fp = await fingerprintEmail("x@y.com", SALT);
    expect(c.pseudonymise).toHaveBeenCalledWith(
      "w1",
      expect.objectContaining({ email: fp, erased: true }),
    );
    expect(r.anonymized).toEqual({ waitlistEntry: 1 });
  });

  it("delete() is a no-op — Sanity records are pseudonymised, not deleted", async () => {
    const c = mockClient({ waitlistEntry: [{ _id: "w1" }] });
    const a = createSanityErasureAdapter(c, SALT);
    const r = await a.delete("x@y.com");
    expect(c.pseudonymise).not.toHaveBeenCalled();
    expect(r.deleted).toEqual({});
  });

  it("preview reports counts without mutating", async () => {
    const c = mockClient({ waitlistEntry: [{ _id: "w1" }] });
    const a = createSanityErasureAdapter(c, SALT);
    const p = await a.preview("x@y.com");
    expect(p.wouldAnonymize).toEqual({ waitlistEntry: 1 });
    expect(c.pseudonymise).not.toHaveBeenCalled();
  });
});
