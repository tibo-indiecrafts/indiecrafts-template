// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// Runs the REAL shared handler through this app's route; mocks only its boundaries — the
// forwarder (holds APP_API_TOKEN) and the rate limiter (so the 429 path can be driven).
const { forwardCspReports, rateLimit } = vi.hoisted(() => ({
  forwardCspReports: vi.fn(async () => {}),
  rateLimit: vi.fn(async () => ({ ok: true, remaining: 30 })),
}));
vi.mock("@indiecrafts/packages-web-security-reports/forward", () => ({
  forwardCspReports,
}));
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({ rateLimit }));

const { POST } = await import("./route");

const violation = JSON.stringify([
  {
    type: "csp-violation",
    body: {
      effectiveDirective: "img-src",
      documentURL: "https://admin.x.dev/en/users",
      blockedURL: "https://evil.example/a.png",
      disposition: "enforce",
    },
  },
]);

function report(
  body: string,
  headers: Record<string, string> = { "content-type": "application/reports+json" },
) {
  return POST(
    new Request("https://admin.x.dev/api/csp-report", { method: "POST", body, headers }),
  );
}

beforeEach(() => {
  forwardCspReports.mockClear();
  rateLimit.mockClear();
});

describe("POST /api/csp-report", () => {
  it("forwards a valid report tagged with the admin surface — 204, empty body", async () => {
    const res = await report(violation);
    expect(res.status).toBe(204);
    expect(await res.text()).toBe("");
    expect(forwardCspReports).toHaveBeenCalledOnce();
    const [[forwarded]] = forwardCspReports.mock.calls as unknown as [
      [{ surface: string; blockedSource: string }[]],
    ];
    expect(forwarded[0]).toMatchObject({
      surface: "admin",
      blockedSource: "https://evil.example",
    });
  });

  it("needs no session — the browser posts reports anonymously", async () => {
    // No Clerk mock here: the route never calls auth(), so signed out is the normal case.
    expect((await report(violation)).status).toBe(204);
  });

  it("refuses a non-CSP content-type with 415", async () => {
    const res = await report(violation, { "content-type": "application/json" });
    expect(res.status).toBe(415);
    expect(forwardCspReports).not.toHaveBeenCalled();
  });

  it("refuses an oversize body with 413", async () => {
    const big = JSON.stringify([{ type: "csp-violation", body: { x: "a".repeat(70_000) } }]);
    expect((await report(big)).status).toBe(413);
    expect(forwardCspReports).not.toHaveBeenCalled();
  });

  it("answers malformed JSON with 204 and forwards nothing", async () => {
    expect((await report("{not json")).status).toBe(204);
    expect(forwardCspReports).not.toHaveBeenCalled();
  });

  it("rate-limits per client with 429", async () => {
    rateLimit.mockResolvedValueOnce({ ok: false, remaining: 0 });
    expect((await report(violation)).status).toBe(429);
    expect(rateLimit).toHaveBeenCalledWith(expect.stringMatching(/^csp:admin:/), 30, 60);
    expect(forwardCspReports).not.toHaveBeenCalled();
  });
});
