import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleCspReport } from "./handle";
import { forwardCspReports } from "./forward";

vi.mock("./forward", () => ({ forwardCspReports: vi.fn() }));

const report = (body: object) => [{ type: "csp-violation", body }];

describe("handleCspReport", () => {
  beforeEach(() => vi.mocked(forwardCspReports).mockClear());

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
