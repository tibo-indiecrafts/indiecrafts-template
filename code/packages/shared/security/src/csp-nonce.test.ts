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
      "production",
      {},
      reporting,
      "n0nce",
      "enforce",
    );
    expect(enforced).toContain("'nonce-n0nce' 'strict-dynamic'");
    expect(enforced).toContain("report-uri /api/csp-report");
    expect(reportOnly).toBeNull();
  });

  it("report-only → permissive enforced + strict report-only", () => {
    const { enforced, reportOnly } = cspHeadersForMode(
      "production",
      {},
      reporting,
      "n0nce",
      "report-only",
    );
    expect(enforced).toContain("script-src 'self' 'unsafe-inline'"); // permissive, site works
    expect(enforced).not.toContain("strict-dynamic");
    expect(reportOnly).toContain("'nonce-n0nce' 'strict-dynamic'"); // strict, observed
    expect(reportOnly).toContain("report-uri /api/csp-report");
  });

  it("report-only → the enforced policy carries the nonce for Next, inline stays allowed", () => {
    const { enforced } = cspHeadersForMode(
      "production",
      {},
      reporting,
      "n0nce",
      "report-only",
    );
    const directive = (name: string) =>
      enforced.split("; ").find((d) => d.startsWith(`${name} `)) ?? "";
    // Next reads the nonce from the enforced header's `script-src` — without it, it
    // nonces none of its own scripts and the Report-Only policy reports every chunk.
    expect(directive("script-src")).toContain("'nonce-n0nce'");
    // Browsers judge <script> + handlers by these (CSP3); no nonce → 'unsafe-inline' holds.
    expect(directive("script-src-elem")).toContain("'unsafe-inline'");
    expect(directive("script-src-elem")).not.toContain("nonce-");
    // An editor's embed script (Custom HTML) from any https host still runs in a rollback.
    expect(directive("script-src-elem").split(" ")).toContain("https:");
    expect(directive("script-src-attr")).toBe(
      "script-src-attr 'unsafe-inline'",
    );
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
