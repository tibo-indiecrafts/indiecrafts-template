import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth } = vi.hoisted(() => ({ auth: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({ auth }));

const { logConsent } = vi.hoisted(() => ({ logConsent: vi.fn() }));
vi.mock("@indiecrafts/packages-shared-compliance/server/consent-log", () => ({
  logConsent,
}));

const { POST } = await import("./route");

const decision = {
  events: [{ type: "cookie_analytics", granted: true }],
  version: "1",
  source: "banner",
  decisionId: "d-1",
};
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://x.dev/api/consent-log", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers,
  });

beforeEach(() => {
  auth.mockReset();
  logConsent.mockReset();
  logConsent.mockResolvedValue(undefined);
});

describe("POST /api/consent-log (app)", () => {
  it("logs nothing for a signed-out visitor (204)", async () => {
    auth.mockResolvedValue({ userId: null });
    const res = await POST(request(decision));
    expect(res.status).toBe(204);
    expect(logConsent).not.toHaveBeenCalled();
  });

  it("forwards a signed-in decision with the server-resolved user + country", async () => {
    auth.mockResolvedValue({ userId: "user_1" });
    const res = await POST(request(decision, { "cf-ipcountry": "FR" }));
    expect(res.status).toBe(204);
    expect(logConsent).toHaveBeenCalledWith({
      userId: "user_1",
      consentId: null,
      events: decision.events,
      version: "1",
      source: "banner",
      surface: "app",
      country: "FR",
      decisionId: "d-1",
      clientIp: "unknown",
    });
  });

  it("rejects a malformed body (400) and an oversized one (413)", async () => {
    auth.mockResolvedValue({ userId: "user_1" });
    expect((await POST(request("not json"))).status).toBe(400);
    expect((await POST(request({ events: [] }))).status).toBe(400);
    expect((await POST(request("x".repeat(4001)))).status).toBe(413);
    expect(logConsent).not.toHaveBeenCalled();
  });
});
