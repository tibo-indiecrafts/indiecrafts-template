import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleCspReport } from "./handle";
import { forwardCspReports } from "./forward";
import { rateLimit } from "@indiecrafts/packages-shared-security/rate-limit";

vi.mock("./forward", () => ({ forwardCspReports: vi.fn() }));
// Off-CF the real limiter no-ops (allows); mock it so we can drive the 429 path.
vi.mock("@indiecrafts/packages-shared-security/rate-limit", () => ({
  rateLimit: vi.fn(async () => ({ ok: true, remaining: 30 })),
}));

const report = (body: object) => [{ type: "csp-violation", body }];

describe("handleCspReport", () => {
  beforeEach(() => {
    vi.mocked(forwardCspReports).mockClear();
    vi.mocked(rateLimit).mockClear();
    vi.mocked(rateLimit).mockResolvedValue({ ok: true, remaining: 30 });
  });

  it("rejects a non-CSP content-type with 415", async () => {
    const res = await handleCspReport(
      new Request("https://x.dev/api/csp-report", { method: "POST", body: "{}", headers: { "content-type": "text/plain" } }),
      { surface: "website" },
    );
    expect(res.status).toBe(415);
    expect(forwardCspReports).not.toHaveBeenCalled();
  });

  it("normalizes, sanitizes, and forwards a valid report as 204", async () => {
    const body = JSON.stringify(
      report({ effectiveDirective: "img-src", documentURL: "https://x.dev/p/7", blockedURL: "https://evil.example/a.png", sourceFile: "", disposition: "report" }),
    );
    const res = await handleCspReport(
      new Request("https://x.dev/api/csp-report", { method: "POST", body, headers: { "content-type": "application/reports+json" } }),
      { surface: "website" },
    );
    expect(res.status).toBe(204);
    expect(forwardCspReports).toHaveBeenCalledOnce();
    const forwarded = vi.mocked(forwardCspReports).mock.calls[0][0];
    expect(forwarded[0].blockedSource).toBe("https://evil.example");
    expect(forwarded[0].surface).toBe("website");
  });

  it("rate-limits a spamming IP with 429 and never reads the body", async () => {
    vi.mocked(rateLimit).mockResolvedValueOnce({ ok: false, remaining: 0 });
    const res = await handleCspReport(
      new Request("https://x.dev/api/csp-report", {
        method: "POST",
        body: JSON.stringify(report({ effectiveDirective: "img-src", documentURL: "https://x.dev/", blockedURL: "https://evil.example/a.png", disposition: "report" })),
        headers: { "content-type": "application/reports+json", "cf-connecting-ip": "203.0.113.7" },
      }),
      { surface: "website" },
    );
    expect(res.status).toBe(429);
    expect(rateLimit).toHaveBeenCalledWith("csp:website:203.0.113.7", 30, 60);
    expect(forwardCspReports).not.toHaveBeenCalled();
  });

  it("drops extension noise and does not forward", async () => {
    const body = JSON.stringify(
      report({ effectiveDirective: "script-src-elem", documentURL: "https://x.dev/", blockedURL: "chrome-extension://a/b.js", disposition: "report" }),
    );
    const res = await handleCspReport(
      new Request("https://x.dev/api/csp-report", { method: "POST", body, headers: { "content-type": "application/reports+json" } }),
      { surface: "website" },
    );
    expect(res.status).toBe(204);
    expect(forwardCspReports).not.toHaveBeenCalled();
  });
});
