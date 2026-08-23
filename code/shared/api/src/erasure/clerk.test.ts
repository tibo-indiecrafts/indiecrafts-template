import { describe, expect, it, vi } from "vitest";
import { createClerkErasureAdapter, type ClerkErasureClient } from "./clerk";

function mockClient(userId: string | null): ClerkErasureClient {
  return {
    findUserIdByEmail: vi.fn(async () => userId),
    exportUser: vi.fn(async () => ({ id: userId, email: "x@y.com" })),
    deleteUser: vi.fn(async () => {}),
  };
}

describe("Clerk erasure adapter", () => {
  it("delete() removes the Clerk user when found", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    const r = await a.delete("x@y.com");
    expect(c.deleteUser).toHaveBeenCalledWith("user_1");
    expect(r.deleted.clerk_user).toBe(1);
  });

  it("delete() is a no-op when the user is not found", async () => {
    const c = mockClient(null);
    const a = createClerkErasureAdapter(c);
    const r = await a.delete("x@y.com");
    expect(c.deleteUser).not.toHaveBeenCalled();
    expect(r.deleted.clerk_user).toBe(0);
  });

  it("anonymize() is a no-op — Clerk's erasure IS deletion", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    const r = await a.anonymize("x@y.com");
    expect(c.deleteUser).not.toHaveBeenCalled();
    expect(r.anonymized).toEqual({});
  });

  it("export() returns the Clerk user snapshot; findByEmail reports presence", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    expect((await a.findByEmail("x@y.com")).found).toBe(true);
    expect(await a.export("x@y.com")).toMatchObject({ id: "user_1" });
  });

  it("preview() reports the pending deletion without calling deleteUser", async () => {
    const c = mockClient("user_1");
    const a = createClerkErasureAdapter(c);
    const p = await a.preview("x@y.com");
    expect(p.wouldDelete.clerk_user).toBe(1);
    expect(c.deleteUser).not.toHaveBeenCalled();
  });
});
