import { describe, expect, it } from "vitest";
import { buildCsp } from "./csp";
import { securityHeaders, studioCspRule, permissiveCspRule } from "./headers";

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

  it("frameAncestors opens framing to the listed origins only", () => {
    const csp = buildCsp("production", { frameAncestors: ["'self'"] });
    expect(csp).toContain("frame-ancestors 'self';");
    const xfo = securityHeaders({
      env: "production",
      csp: { frameAncestors: ["'self'"] },
    })[0].headers.find((h) => h.key === "X-Frame-Options");
    expect(xfo?.value).toBe("SAMEORIGIN");
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

  it("emits EXACTLY the production header set + values (regression lock)", () => {
    const rules = securityHeaders({ env: "production" });
    expect(rules).toHaveLength(1); // no immutablePaths → just the global rule
    expect(rules[0].source).toBe("/:path*");
    const headers = rules[0].headers;
    // Exact ordered key set — catches an accidental added/removed header.
    expect(headers.map((h) => h.key)).toEqual([
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Content-Security-Policy",
      "Cross-Origin-Opener-Policy",
      "Strict-Transport-Security",
    ]);
    const value = (k: string) => headers.find((h) => h.key === k)?.value;
    expect(value("X-Content-Type-Options")).toBe("nosniff");
    expect(value("X-Frame-Options")).toBe("DENY");
    expect(value("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    const permissions = value("Permissions-Policy") ?? "";
    // Sensor/hardware/payment/privacy features locked; embed-needed ones left open.
    expect(permissions).toContain("camera=()");
    expect(permissions).toContain("payment=()");
    expect(permissions).toContain("browsing-topics=()");
    expect(permissions).toContain("usb=()");
    expect(permissions).not.toContain("autoplay");
    expect(permissions).not.toContain("fullscreen");
    expect(value("Cross-Origin-Opener-Policy")).toBe(
      "same-origin-allow-popups",
    );
    expect(value("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains",
    );
  });

  it("dev drops HSTS but keeps the rest of the set", () => {
    expect(keys(securityHeaders({ env: "development" }))).toEqual([
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Content-Security-Policy",
      "Cross-Origin-Opener-Policy",
    ]);
  });
});

describe("permissiveCspRule", () => {
  it("scopes the permissive CSP to the given source (studio + maintenance)", () => {
    const studio = studioCspRule("production");
    expect(studio.source).toBe("/studio/:path*");
    const maintenance = permissiveCspRule("/maintenance", "production");
    expect(maintenance.source).toBe("/maintenance");
    // Both use the permissive (non-nonce) policy.
    const csp = (r: typeof maintenance) =>
      r.headers.find((h) => h.key === "Content-Security-Policy")?.value;
    expect(csp(maintenance)).toBe(buildCsp("production"));
    // The Studio adds only Sanity's own bridge script + font hosts.
    expect(csp(studio)).toBe(
      buildCsp("production", {
        scriptSrc: ["https://core.sanity-cdn.com"],
        fontSrc: ["https://design-system-static.sanity.io"],
      }),
    );
  });

  it("adds Reporting-Endpoints only when a reporting endpoint is given", () => {
    const bare = permissiveCspRule("/maintenance", "production");
    expect(bare.headers.some((h) => h.key === "Reporting-Endpoints")).toBe(
      false,
    );
    const reported = permissiveCspRule(
      "/maintenance",
      "production",
      {},
      {
        endpoint: "/api/csp-report",
      },
    );
    expect(
      reported.headers.find((h) => h.key === "Reporting-Endpoints")?.value,
    ).toBe('csp-endpoint="/api/csp-report"');
  });
});
