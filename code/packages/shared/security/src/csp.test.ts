import { describe, expect, it } from "vitest";
import { buildCsp, buildReportOnlyCsp } from "./csp";
import { securityHeaders } from "./headers";

const REPORTING = { endpoint: "/api/csp-report", reportOnly: { dropSources: ["https:"] } };

describe("csp reporting", () => {
  it("appends report-to and report-uri to the enforced policy", () => {
    const csp = buildCsp("production", {}, REPORTING);
    expect(csp).toContain("report-to csp-endpoint");
    expect(csp).toContain("report-uri /api/csp-report");
  });

  it("enforced policy is unchanged when reporting is omitted", () => {
    const csp = buildCsp("production", {});
    expect(csp).not.toContain("report-to");
    expect(csp).not.toContain("report-uri");
  });

  it("candidate drops the named source from the enforced policy", () => {
    const enforced = buildCsp("production", {});
    const candidate = buildReportOnlyCsp("production", {}, REPORTING);
    expect(enforced).toContain("img-src 'self' data: blob: https:");
    expect(candidate).not.toBeNull();
    expect(candidate).not.toContain("blob: https:"); // https: removed from img-src
    expect(candidate).toContain("report-to csp-endpoint");
  });

  it("candidate is null without reportOnly", () => {
    expect(buildReportOnlyCsp("production", {}, { endpoint: "/api/csp-report" })).toBeNull();
  });

  it("securityHeaders emits Reporting-Endpoints and the Report-Only header", () => {
    const rules = securityHeaders({ env: "production", reporting: REPORTING });
    const global = rules[0].headers;
    const keys = global.map((h) => h.key);
    expect(keys).toContain("Reporting-Endpoints");
    expect(keys).toContain("Content-Security-Policy-Report-Only");
    expect(global.find((h) => h.key === "Reporting-Endpoints")?.value).toBe(
      'csp-endpoint="/api/csp-report"',
    );
  });
});
