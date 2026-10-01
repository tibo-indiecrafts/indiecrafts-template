import { afterEach, describe, expect, it, vi } from "vitest";

const { getUserList } = vi.hoisted(() => ({ getUserList: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: async () => ({ users: { getUserList } }),
}));

const { primaryEmail, fetchEmails } = await import("./clerk-users");

afterEach(() => vi.clearAllMocks());

describe("primaryEmail", () => {
  it("prefers the primary address, then the first, else null", () => {
    expect(
      primaryEmail({
        primaryEmailAddress: { emailAddress: "a@x.dev" },
        emailAddresses: [{ emailAddress: "b@x.dev" }],
      }),
    ).toBe("a@x.dev");
    expect(
      primaryEmail({ primaryEmailAddress: null, emailAddresses: [{ emailAddress: "b@x.dev" }] }),
    ).toBe("b@x.dev");
    expect(primaryEmail({ primaryEmailAddress: null, emailAddresses: [] })).toBeNull();
  });
});

describe("fetchEmails", () => {
  it("looks up each distinct user id once and maps id → email", async () => {
    getUserList.mockResolvedValueOnce({
      data: [
        { id: "user_1", primaryEmailAddress: { emailAddress: "one@x.dev" }, emailAddresses: [] },
      ],
    });
    expect(await fetchEmails(["user_1", "user_1", "user_2"])).toEqual({ "user_1": "one@x.dev" });
    expect(getUserList).toHaveBeenCalledWith({ userId: ["user_1", "user_2"], limit: 100 });
  });

  it("skips Clerk for no ids, and fails open to {} on an error", async () => {
    expect(await fetchEmails([])).toEqual({});
    expect(getUserList).not.toHaveBeenCalled();
    getUserList.mockRejectedValueOnce(new Error("clerk down"));
    expect(await fetchEmails(["user_1"])).toEqual({});
  });
});
