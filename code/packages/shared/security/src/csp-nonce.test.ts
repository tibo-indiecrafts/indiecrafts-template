import { describe, expect, it } from "vitest";
import { generateNonce, cspHeadersForMode } from "./csp-nonce";

describe("generateNonce", () => {
  it("returns a non-empty base64 nonce, unique per call", () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(a.length).toBeGreaterThanOrEqual(16);
    expect(a).not.toBe(b);
  });
});

describe("cspHeadersForMode", () => {
  const reporting = { endpoint: "/api/csp-report" };
  it("enforce → strict enforced, no report-only", () => {
    const { enforced, reportOnly } = cspHeadersForMode(
      "production", {}, reporting, "n0nce", "enforce",
    );
    expect(enforced).toContain("'nonce-n0nce' 'strict-dynamic'");
    expect(enforced).toContain("report-uri /api/csp-report");
    expect(reportOnly).toBeNull();
  });

  it("report-only → permissive enforced + strict report-only", () => {
    const { enforced, reportOnly } = cspHeadersForMode(
      "production", {}, reporting, "n0nce", "report-only",
    );
    expect(enforced).toContain("script-src 'self' 'unsafe-inline'"); // permissive, site works
    expect(enforced).not.toContain("strict-dynamic");
    expect(reportOnly).toContain("'nonce-n0nce' 'strict-dynamic'"); // strict, observed
    expect(reportOnly).toContain("report-uri /api/csp-report");
  });

  it("enforce + trustedTypesReportOnly → strict enforced + Trusted-Types report-only trial", () => {
    const { enforced, reportOnly } = cspHeadersForMode(
      "production",
      {},
      { endpoint: "/api/csp-report", trustedTypesReportOnly: true },
      "n0nce",
      "enforce",
    );
    expect(enforced).toContain("'strict-dynamic'"); // enforced policy unchanged
    // The Report-Only slot now carries the Trusted-Types trial (reports, never blocks).
    expect(reportOnly).toContain("require-trusted-types-for 'script'");
    expect(reportOnly).toContain("report-uri /api/csp-report");
    // It's a TT-only trial, not the full strict policy.
    expect(reportOnly).not.toContain("strict-dynamic");
  });
});
