import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { fetchEmailPreferences } = await import("./email-preferences");
const USER = "user_2abcEMAILPREFS00001";
const ADMIN = "user_2abcADMIN000000001";
const STATE = { subject: { userId: USER, email: "a@x.com" }, categories: [], resend: null };

beforeEach(() => {
  process.env.API_URL = "https://api.x";
  process.env.APP_API_TOKEN = "tok";
});
afterEach(() => vi.unstubAllGlobals());

describe("fetchEmailPreferences", () => {
  it("reads an account or an address with the bearer, naming the admin (the api audits)", async () => {
    const f = vi.fn(async (_url: string, _init?: RequestInit) => Response.json(STATE));
    vi.stubGlobal("fetch", f);
    expect(await fetchEmailPreferences({ userId: USER }, ADMIN)).toEqual(STATE);
    expect(f).toHaveBeenCalledWith(
      `https://api.x/v1/admin/email-preferences?userId=${USER}&actorUserId=${ADMIN}`,
      expect.objectContaining({ headers: { authorization: "Bearer tok" } }),
    );
    await fetchEmailPreferences({ email: " a+b@x.com " }, ADMIN);
    expect(f.mock.calls[1]?.[0]).toBe(
      `https://api.x/v1/admin/email-preferences?email=a%2Bb%40x.com&actorUserId=${ADMIN}`,
    );
  });

  it("returns null — never a false empty state — on a bad id, address or api error", async () => {
    const f = vi.fn(async () => new Response("", { status: 502 }));
    vi.stubGlobal("fetch", f);
    expect(await fetchEmailPreferences({ userId: "nope" }, ADMIN)).toBeNull();
    expect(await fetchEmailPreferences({ email: "a/b@x.com" }, ADMIN)).toBeNull();
    expect(await fetchEmailPreferences({ userId: USER }, "admin")).toBeNull();
    expect(f).not.toHaveBeenCalled();
    expect(await fetchEmailPreferences({ userId: USER }, ADMIN)).toBeNull();
  });
});
