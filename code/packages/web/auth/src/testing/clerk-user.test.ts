import { afterEach, describe, expect, it, vi } from "vitest";
import { throwawayClerkUser } from "./clerk-user";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("throwawayClerkUser", () => {
  it("creates a +clerk_test user with the secret key, then deletes it by id", async () => {
    vi.stubEnv("CLERK_SECRET_KEY", "sk_test_x");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 200 })) // create
      .mockResolvedValueOnce(Response.json([{ id: "user_1" }])) // find
      .mockResolvedValueOnce(new Response("{}", { status: 200 })); // delete
    vi.stubGlobal("fetch", fetchMock);

    const user = throwawayClerkUser("t");
    expect(user.email).toMatch(/^e2e-t-\d+\+clerk_test@example\.com$/);
    await user.create();
    await user.remove();

    const [createUrl, create] = fetchMock.mock.calls[0]!;
    expect(createUrl).toBe("https://api.clerk.com/v1/users");
    expect(create.headers.authorization).toBe("Bearer sk_test_x");
    expect(JSON.parse(create.body).email_address).toEqual([user.email]);
    expect(fetchMock.mock.calls[2]![0]).toBe(
      "https://api.clerk.com/v1/users/user_1",
    );
    expect(fetchMock.mock.calls[2]![1].method).toBe("DELETE");
  });

  it("create throws on a Clerk error; remove skips a user that is already gone", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("{}", { status: 422 }))
      .mockResolvedValueOnce(Response.json([]));
    vi.stubGlobal("fetch", fetchMock);
    const user = throwawayClerkUser("t");
    await expect(user.create()).rejects.toThrow("422");
    await user.remove();
    expect(fetchMock).toHaveBeenCalledTimes(2); // no DELETE
  });
});
