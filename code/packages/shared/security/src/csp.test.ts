import { describe, expect, it, afterEach } from "vitest";
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

describe("clerk csp hosts (derived from the publishable key)", () => {
  const KEY = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY";
  const original = process.env[KEY];
  afterEach(() => {
    if (original === undefined) delete process.env[KEY];
    else process.env[KEY] = original;
  });

  it("adds Clerk hosts + worker-src when the key is set (so sign-in isn't blocked)", () => {
    process.env[KEY] = "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k"; // → clerk.example.com
    const csp = buildCsp("production", {});
    expect(csp).toContain("https://clerk.example.com");
    expect(csp).toContain("https://img.clerk.com");
    expect(csp).toContain("https://clerk-telemetry.com");
    expect(csp).toContain("worker-src 'self' blob:");
  });

  it("adds no Clerk hosts and no worker-src when the key is unset", () => {
    delete process.env[KEY];
    const csp = buildCsp("production", {});
    expect(csp).not.toContain("clerk");
    expect(csp).not.toContain("worker-src");
  });
});
