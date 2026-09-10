import { describe, expect, it } from "vitest";
import {
  collapseRoute,
  isExtensionNoise,
  normalizeCspReports,
  sanitizeCspReport,
} from "./csp-report";

describe("collapseRoute", () => {
  it("collapses numeric, uuid, and long hex segments to :id", () => {
    expect(collapseRoute("/orders/93847")).toBe("/orders/:id");
    expect(collapseRoute("/u/2f1c8e9a-1b2c-4d5e-8f90-a1b2c3d4e5f6")).toBe(
      "/u/:id",
    );
    expect(collapseRoute("/a/deadbeefdeadbeef99")).toBe("/a/:id");
    expect(collapseRoute("/blog/hello-world")).toBe("/blog/hello-world");
  });
});

describe("isExtensionNoise", () => {
  it("flags browser-extension origins", () => {
    expect(isExtensionNoise("chrome-extension://abc/inject.js")).toBe(true);
    expect(isExtensionNoise("moz-extension://x/y.js")).toBe(true);
    expect(isExtensionNoise("https://cdn.example/x.js")).toBe(false);
  });
});

describe("normalizeCspReports", () => {
  it("reads the modern reports+json array", () => {
    const raw = [
      {
        type: "csp-violation",
        body: {
          effectiveDirective: "script-src-elem",
          documentURL: "https://x.dev/orders/9?mode=edit",
          blockedURL: "inline",
          sourceFile: "https://x.dev/orders/9",
          lineNumber: 18,
          sample: "",
          disposition: "report",
        },
      },
    ];
    const out = normalizeCspReports(raw, "application/reports+json");
    expect(out).toHaveLength(1);
    expect(out[0].directive).toBe("script-src-elem");
    expect(out[0].blockedUrl).toBe("inline");
  });

  it("reads the legacy csp-report object", () => {
    const raw = {
      "csp-report": {
        "effective-directive": "img-src",
        "document-uri": "https://x.dev/p/5",
        "blocked-uri": "https://evil.example/a.png?token=abc",
        "source-file": "https://x.dev/p/5",
        "line-number": 3,
        "script-sample": "",
        disposition: "enforce",
      },
    };
    const out = normalizeCspReports(raw, "application/csp-report");
    expect(out[0].directive).toBe("img-src");
    expect(out[0].disposition).toBe("enforce");
  });
});

describe("sanitizeCspReport", () => {
  it("collapses the route, reduces the blocked url to origin, strips query", () => {
    const s = sanitizeCspReport(
      {
        directive: "img-src",
        documentUrl: "https://x.dev/orders/93847?mode=edit",
        blockedUrl: "https://analytics.example/collect/customer-1?token=abc",
        sourceFile: "https://cdn.example/checkout.83af.js?signature=secret",
        line: 4,
        snippet: 'window.email = "person@email.com"',
        disposition: "report",
      },
      "website",
    );
    expect(s).not.toBeNull();
    expect(s!.documentPath).toBe("/orders/:id");
    expect(s!.blockedSource).toBe("https://analytics.example");
    expect(s!.sampleSourceFile).toBe("https://cdn.example/checkout.83af.js");
    expect(s!.sampleSnippet).toBe('window.email = "[email]"');
    expect(s!.surface).toBe("website");
  });

  it("keeps literal blocked values like inline", () => {
    const s = sanitizeCspReport(
      {
        directive: "script-src-elem",
        documentUrl: "https://x.dev/",
        blockedUrl: "inline",
        sourceFile: "",
        line: null,
        snippet: "",
        disposition: "report",
      },
      "admin",
    );
    expect(s!.blockedSource).toBe("inline");
  });

  it("drops extension noise", () => {
    const s = sanitizeCspReport(
      {
        directive: "script-src-elem",
        documentUrl: "https://x.dev/",
        blockedUrl: "chrome-extension://a/b.js",
        sourceFile: "",
        line: null,
        snippet: "",
        disposition: "report",
      },
      "website",
    );
    expect(s).toBeNull();
  });
});
