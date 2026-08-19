import { describe, expect, it } from "vitest";
import { buildCsp } from "./csp";
import { securityHeaders } from "./headers";

const cspOf = (rules: ReturnType<typeof securityHeaders>) =>
  rules[0].headers.find((h) => h.key === "Content-Security-Policy")?.value ??
  "";
const keys = (rules: ReturnType<typeof securityHeaders>) =>
  rules[0].headers.map((h) => h.key);

describe("buildCsp", () => {
  it("has the hardened directives + Sanity connect base", () => {
    const csp = buildCsp("production");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("https://*.sanity.io"); // from getCSPConnectSources
    expect(csp).toContain("upgrade-insecure-requests"); // prod only
  });

  it("dev adds 'unsafe-eval' + localhost; prod does not", () => {
    expect(buildCsp("development")).toContain("'unsafe-eval'");
    expect(buildCsp("development")).toContain("http://localhost:*");
    expect(buildCsp("production")).not.toContain("'unsafe-eval'");
    expect(buildCsp("production")).not.toContain("localhost");
  });

  it("injects extras into the right directives", () => {
    const csp = buildCsp("production", {
      frameSrc: ["https://player.vimeo.com"],
      mediaSrc: ["https://cdn.sanity.io"],
      embedHosts: ["https://x.list-manage.com"],
      googleAnalytics: true,
    });
    expect(csp).toMatch(/frame-src [^;]*https:\/\/player\.vimeo\.com/);
    expect(csp).toMatch(/media-src [^;]*https:\/\/cdn\.sanity\.io/);
    expect(csp).toMatch(/form-action [^;]*https:\/\/x\.list-manage\.com/); // embed hosts
    expect(csp).toContain("https://*.googletagmanager.com"); // GA
  });
});

describe("securityHeaders", () => {
  it("HSTS only in production", () => {
    expect(keys(securityHeaders({ env: "production" }))).toContain(
      "Strict-Transport-Security",
    );
    expect(keys(securityHeaders({ env: "development" }))).not.toContain(
      "Strict-Transport-Security",
    );
  });

  it("COOP defaults to allow-popups (Sanity Studio login)", () => {
    const coop = securityHeaders({ env: "production" })[0].headers.find(
      (h) => h.key === "Cross-Origin-Opener-Policy",
    );
    expect(coop?.value).toBe("same-origin-allow-popups");
  });

  it("ships the core header set + maps immutable paths", () => {
    const rules = securityHeaders({
      env: "production",
      immutablePaths: ["/logo.svg"],
    });
    expect(keys(rules)).toEqual(
      expect.arrayContaining([
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Content-Security-Policy",
      ]),
    );
    expect(cspOf(rules)).toContain("default-src 'self'");
    expect(
      rules.find((r) => r.source === "/logo.svg")?.headers[0].value,
    ).toContain("immutable");
  });

  it("hsts:false omits it even in production", () => {
    expect(
      keys(securityHeaders({ env: "production", hsts: false })),
    ).not.toContain("Strict-Transport-Security");
  });
});
