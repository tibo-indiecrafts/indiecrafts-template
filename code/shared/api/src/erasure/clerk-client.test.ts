import { describe, expect, it, vi } from "vitest";
import type { ClerkClient } from "@clerk/backend";
import { createRealClerkClient } from "./clerk-client";

function fakeClerk(userId: string | null): ClerkClient {
  return {
    users: {
      getUserList: vi.fn(async () => ({
        data: userId ? [{ id: userId }] : [],
      })),
      getUser: vi.fn(async (id: string) => ({ id })),
      deleteUser: vi.fn(async () => {}),
    },
  } as unknown as ClerkClient;
}

describe("createRealClerkClient", () => {
  it("findUserIdByEmail calls getUserList with the lowercased, trimmed email", async () => {
    const clerk = fakeClerk("user_1");
    const client = createRealClerkClient("sk_test", async () => clerk);
    const id = await client.findUserIdByEmail(" X@Y.com ");
    expect(clerk.users.getUserList).toHaveBeenCalledWith({
      emailAddress: ["x@y.com"],
    });
    expect(id).toBe("user_1");
  });

  it("findUserIdByEmail returns null when no user matches", async () => {
    const clerk = fakeClerk(null);
    const client = createRealClerkClient("sk_test", async () => clerk);
    expect(await client.findUserIdByEmail("x@y.com")).toBeNull();
  });

  it("exportUser delegates to clerk.users.getUser", async () => {
    const clerk = fakeClerk("user_1");
    const client = createRealClerkClient("sk_test", async () => clerk);
    const user = await client.exportUser("user_1");
    expect(clerk.users.getUser).toHaveBeenCalledWith("user_1");
    expect(user).toEqual({ id: "user_1" });
  });

  it("deleteUser delegates to clerk.users.deleteUser", async () => {
    const clerk = fakeClerk("user_1");
    const client = createRealClerkClient("sk_test", async () => clerk);
    await client.deleteUser("user_1");
    expect(clerk.users.deleteUser).toHaveBeenCalledWith("user_1");
  });
});
