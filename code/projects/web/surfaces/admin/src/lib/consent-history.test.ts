import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { audit } = vi.hoisted(() => ({ audit: vi.fn() }));
vi.mock("@/lib/audit", () => ({ audit }));

const { fetchConsentHistory } = await import("./consent-history");
const USER = "user_2abcHISTORYtest0001";
const HISTORY = { current: [], events: [] };

beforeEach(() => {
  process.env.API_URL = "https://api.x";
  process.env.APP_API_TOKEN = "tok";
  audit.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

describe("fetchConsentHistory", () => {
  it("reads the api with the bearer and audits the view", async () => {
    const f = vi.fn(async () => Response.json(HISTORY));
    vi.stubGlobal("fetch", f);
    expect(await fetchConsentHistory(USER, "user_admin")).toEqual(HISTORY);
    expect(f).toHaveBeenCalledWith(
      `https://api.x/v1/consent/history?userId=${USER}`,
      expect.objectContaining({ headers: { authorization: "Bearer tok" } }),
    );
    expect(audit).toHaveBeenCalledWith("admin.view_consent", {
      actor: "user_admin",
      target: USER,
    });
  });

  it("returns null and audits nothing on a bad id or an api error", async () => {
    const f = vi.fn(async () => new Response("", { status: 502 }));
    vi.stubGlobal("fetch", f);
    expect(await fetchConsentHistory("not-a-user", "user_admin")).toBeNull();
    expect(f).not.toHaveBeenCalled();
    expect(await fetchConsentHistory(USER, "user_admin")).toBeNull();
    expect(audit).not.toHaveBeenCalled();
  });
});
