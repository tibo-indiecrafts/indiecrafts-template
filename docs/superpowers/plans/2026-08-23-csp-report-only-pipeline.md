# CSP Report-Only Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collect, sanitize, and store CSP violation reports from every activated web surface, without enforcing any new policy.

**Architecture:** The browser auto-POSTs violations to a same-origin `/api/csp-report` route on each surface. The route normalizes the two report formats into one shape, sanitizes out PII, drops extension noise, and forwards the survivors with a bearer token to the existing `/v1/events` worker under a new `kind:csp-report`. The worker aggregates rows into a `csp_reports` D1 table (one row per distinct violation group + a count). A cron worker purges rows older than 30 days.

**Tech Stack:** TypeScript (strict) · Next.js 16 · Cloudflare Workers · D1 (SQLite) · Vitest · pnpm 10 · Node 22.

**Spec:** `docs/superpowers/specs/2026-08-23-csp-report-only-pipeline-design.md`

## Global Constraints

- Node 22, pnpm 10, TypeScript strict. No `as any` — use a real type or `unknown` + a guard.
- Bricks are named `@indiecrafts/packages-<scope>-<brick>`, matching the folder tail. A brick NEVER imports an app.
- Apps consume a brick via two wires: add it to `transpilePackages` in the app `next.config.ts` AND a `workspace:*` dep in the app `package.json`.
- Data minimization: `csp_reports` stores NO `country` and NO `ip_hash`. CSP violations are about resources, not people.
- Retention: `CSP_RETENTION_DAYS = 30`.
- The report endpoint is the same-origin relative path `/api/csp-report`. No new environment variable.
- The worker body cap is `BODY_MAX = 4000` bytes — a forwarded batch is at most 10 reports.
- Tests are colocated `*.test.ts` beside the source, never in a separate folder.
- Docs change in lockstep: update the matching `code/docs/**` page AND its sidebar line in `code/docs/.vitepress/config.mts`.
- Changelogs log at their home altitude: `code/packages/CHANGELOG.md`, `code/shared/api/CHANGELOG.md`, `code/shared/cron/CHANGELOG.md`.
- Agent-written text (comments, commits, docs) follows the writing-style rule: active voice, one idea per sentence, lead with the answer.
- Every commit message ends with:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- Do this work on a new branch off `main` (e.g. `feat/csp-report-only`), not on `feat/auth-security-events`.

---

### Task 1: Security brick — CSP reporting header options

Add the ability to emit reporting directives on the enforced policy and a stricter `Content-Security-Policy-Report-Only` candidate. Additive: existing callers are unchanged.

**Files:**
- Modify: `code/packages/shared/security/src/csp.ts`
- Modify: `code/packages/shared/security/src/headers.ts`
- Modify: `code/packages/shared/security/src/index.ts`
- Test: `code/packages/shared/security/src/csp.test.ts` (create if absent; else append)

**Interfaces:**
- Produces: `type CspReporting = { endpoint: string; reportOnly?: { dropSources?: string[]; dropUnsafeEval?: boolean } }`
- Produces: `buildCsp(env, csp?, reporting?: CspReporting): string` — enforced policy; appends `report-to csp-endpoint; report-uri <endpoint>` when `reporting` is set.
- Produces: `buildReportOnlyCsp(env, csp, reporting: CspReporting): string | null` — the candidate; `null` when `reporting.reportOnly` is absent.
- Produces: `securityHeaders(opts)` gains `reporting?: CspReporting`. When set it also emits `Reporting-Endpoints: csp-endpoint="<endpoint>"` and (if `reportOnly`) the `Content-Security-Policy-Report-Only` header.

- [ ] **Step 1: Write the failing test**

Append to `code/packages/shared/security/src/csp.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-shared-security test`
Expected: FAIL — `buildReportOnlyCsp` is not exported; `reporting` is not a known option.

- [ ] **Step 3: Refactor `csp.ts` to share the directive array and add the reporting exports**

Replace the body of `buildCsp` in `code/packages/shared/security/src/csp.ts`. Keep the existing `CspHosts` type, the `GA_*`/`TURNSTILE` consts, and the `src()` helper. Add:

```ts
export type CspReporting = {
  /** Same-origin path the browser POSTs violations to (report-to + report-uri). */
  endpoint: string;
  /** Also emit a stricter Content-Security-Policy-Report-Only candidate. */
  reportOnly?: {
    /** Exact source tokens to remove from the candidate (test dropping them). */
    dropSources?: string[];
    /** Remove 'unsafe-eval' from the candidate. Default true. */
    dropUnsafeEval?: boolean;
  };
};

function cspDirectives(
  env: Environment,
  csp: CspHosts,
  opts: { dropSources?: string[]; dropUnsafeEval?: boolean } = {},
): string[] {
  const dev = env === "development" || env === "test";
  const embed = csp.embedHosts ?? [];
  const ga = csp.googleAnalytics ?? false;
  const allowEval = dev && !opts.dropUnsafeEval;
  const drop = new Set(opts.dropSources ?? []);
  // Filter dropped tokens AFTER composing each source list.
  const keep = (value: string): string =>
    value
      .split(" ")
      .filter((token, i) => i === 0 || !drop.has(token))
      .join(" ");

  const directives = [
    `default-src 'self'`,
    keep(
      `script-src ${src(["'self'", "'unsafe-inline'"], allowEval ? ["'unsafe-eval'"] : undefined, ga ? GA_SCRIPT : undefined, TURNSTILE, csp.scriptSrc, embed)}`,
    ),
    `style-src 'self' 'unsafe-inline'`,
    keep(`img-src ${src(["'self'", "data:", "blob:", "https:"], csp.imgSrc)}`),
    keep(`media-src ${src(["'self'", "blob:"], csp.mediaSrc)}`),
    keep(`font-src ${src(["'self'", "data:"], csp.fontSrc)}`),
    keep(
      `connect-src ${src([...getCSPConnectSources(env)], ga ? GA_CONNECT : undefined, csp.connectSrc, embed)}`,
    ),
    keep(`frame-src ${src(["'self'"], TURNSTILE, csp.frameSrc, embed)}`),
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action ${src(["'self'"], embed)}`,
  ];
  if (env === "production") directives.push("upgrade-insecure-requests");
  return directives;
}

function withReporting(directives: string[], reporting: CspReporting): string[] {
  return [
    ...directives,
    `report-to csp-endpoint`,
    `report-uri ${reporting.endpoint}`,
  ];
}

export function buildCsp(
  env: Environment,
  csp: CspHosts = {},
  reporting?: CspReporting,
): string {
  const directives = cspDirectives(env, csp);
  return (reporting ? withReporting(directives, reporting) : directives).join("; ");
}

export function buildReportOnlyCsp(
  env: Environment,
  csp: CspHosts = {},
  reporting: CspReporting,
): string | null {
  if (!reporting.reportOnly) return null;
  const directives = cspDirectives(env, csp, {
    dropSources: reporting.reportOnly.dropSources,
    dropUnsafeEval: reporting.reportOnly.dropUnsafeEval ?? true,
  });
  return withReporting(directives, reporting).join("; ");
}
```

Note: the original inlined `dev ? ["'unsafe-eval'"]` becomes `allowEval ? ...` so the candidate can drop it. Behavior of the enforced policy is unchanged (default `dropUnsafeEval` is undefined → `allowEval === dev`).

- [ ] **Step 4: Add the `reporting` option to `securityHeaders`**

In `code/packages/shared/security/src/headers.ts`, import the new pieces and wire them.

Change the import line:

```ts
import { buildCsp, buildReportOnlyCsp, type CspHosts, type CspReporting } from "./csp";
```

Add to `SecurityHeadersOptions`:

```ts
  /**
   * CSP violation reporting. Sets `Reporting-Endpoints` + `report-to`/`report-uri`
   * on the enforced policy, and (when `reportOnly` is set) a stricter
   * `Content-Security-Policy-Report-Only` candidate. Off by default.
   */
  reporting?: CspReporting;
```

In the destructured params add `reporting`, and replace the CSP header line and add the reporting headers:

```ts
  const headers: { key: string; value: string }[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: permissionsPolicy },
    { key: "Content-Security-Policy", value: buildCsp(env, csp, reporting) },
  ];
  if (reporting) {
    headers.push({
      key: "Reporting-Endpoints",
      value: `csp-endpoint="${reporting.endpoint}"`,
    });
    const reportOnly = buildReportOnlyCsp(env, csp, reporting);
    if (reportOnly)
      headers.push({
        key: "Content-Security-Policy-Report-Only",
        value: reportOnly,
      });
  }
```

- [ ] **Step 5: Export the new symbols**

In `code/packages/shared/security/src/index.ts`, extend the first export line:

```ts
export {
  buildCsp,
  buildReportOnlyCsp,
  type CspHosts,
  type CspReporting,
} from "./csp";
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm --filter @indiecrafts/packages-shared-security test`
Expected: PASS (all reporting tests green; existing header tests still green).

- [ ] **Step 7: Commit**

```bash
git add code/packages/shared/security/src/csp.ts code/packages/shared/security/src/headers.ts code/packages/shared/security/src/index.ts code/packages/shared/security/src/csp.test.ts
git commit -m "feat(security): CSP reporting directives + Report-Only candidate options

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Security brick — normalize + sanitize CSP reports

Pure, framework-free functions that turn either report format into one sanitized shape. This is the security-critical core; test it hard.

**Files:**
- Create: `code/packages/shared/security/src/csp-report.ts`
- Create: `code/packages/shared/security/src/csp-report.test.ts`
- Modify: `code/packages/shared/security/package.json` (add the `./csp-report` subpath export)

**Interfaces:**
- Produces: `type NormalizedCspReport = { directive: string; documentUrl: string; blockedUrl: string; sourceFile: string; line: number | null; snippet: string; disposition: string }`
- Produces: `type SanitizedCspReport = { surface: string; disposition: "report" | "enforce"; directive: string; documentPath: string; blockedSource: string; sampleSourceFile: string | null; sampleLine: number | null; sampleSnippet: string | null }`
- Produces: `normalizeCspReports(raw: unknown, contentType: string): NormalizedCspReport[]`
- Produces: `sanitizeCspReport(report: NormalizedCspReport, surface: string): SanitizedCspReport | null` (null = dropped noise)
- Produces: `collapseRoute(pathname: string): string`
- Produces: `isExtensionNoise(blockedUrl: string): boolean`

- [ ] **Step 1: Write the failing test**

Create `code/packages/shared/security/src/csp-report.test.ts`:

```ts
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
    expect(collapseRoute("/u/2f1c8e9a-1b2c-4d5e-8f90-a1b2c3d4e5f6")).toBe("/u/:id");
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
      { directive: "script-src-elem", documentUrl: "https://x.dev/", blockedUrl: "inline", sourceFile: "", line: null, snippet: "", disposition: "report" },
      "admin",
    );
    expect(s!.blockedSource).toBe("inline");
  });

  it("drops extension noise", () => {
    const s = sanitizeCspReport(
      { directive: "script-src-elem", documentUrl: "https://x.dev/", blockedUrl: "chrome-extension://a/b.js", sourceFile: "", line: null, snippet: "", disposition: "report" },
      "website",
    );
    expect(s).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @indiecrafts/packages-shared-security test csp-report`
Expected: FAIL — `./csp-report` does not exist.

- [ ] **Step 3: Write the implementation**

Create `code/packages/shared/security/src/csp-report.ts`:

```ts
/**
 * CSP violation report parsing. Pure and framework-free: the same-origin surface
 * route calls these before forwarding, so PII never crosses to the worker. The two
 * browser formats (modern report-to and legacy report-uri) collapse to one shape.
 */

export type NormalizedCspReport = {
  directive: string;
  documentUrl: string;
  blockedUrl: string;
  sourceFile: string;
  line: number | null;
  snippet: string;
  disposition: string;
};

export type SanitizedCspReport = {
  surface: string;
  disposition: "report" | "enforce";
  directive: string;
  documentPath: string;
  blockedSource: string;
  sampleSourceFile: string | null;
  sampleLine: number | null;
  sampleSnippet: string | null;
};

const str = (v: unknown, max = 256): string =>
  typeof v === "string" ? v.slice(0, max) : "";
const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const EXTENSION_SCHEMES = [
  "chrome-extension:",
  "moz-extension:",
  "safari-web-extension:",
  "safari-extension:",
];

export function isExtensionNoise(blockedUrl: string): boolean {
  return EXTENSION_SCHEMES.some((s) => blockedUrl.startsWith(s));
}

/** Collapse numeric, UUID, and long-hex path segments to `:id`. Drops nothing else. */
export function collapseRoute(pathname: string): string {
  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const collapsed = pathname
    .split("/")
    .map((seg) => {
      if (seg === "") return seg;
      if (/^\d+$/.test(seg)) return ":id";
      if (uuid.test(seg)) return ":id";
      if (/^[0-9a-f]{16,}$/i.test(seg)) return ":id";
      return seg;
    })
    .join("/");
  return collapsed || "/";
}

function fromReportingApi(body: Record<string, unknown>): NormalizedCspReport {
  return {
    directive: str(body.effectiveDirective, 48),
    documentUrl: str(body.documentURL),
    blockedUrl: str(body.blockedURL),
    sourceFile: str(body.sourceFile),
    line: num(body.lineNumber),
    snippet: str(body.sample, 200),
    disposition: str(body.disposition, 8),
  };
}

function fromLegacy(report: Record<string, unknown>): NormalizedCspReport {
  return {
    directive: str(report["effective-directive"] ?? report["violated-directive"], 48),
    documentUrl: str(report["document-uri"]),
    blockedUrl: str(report["blocked-uri"]),
    sourceFile: str(report["source-file"]),
    line: num(report["line-number"]),
    snippet: str(report["script-sample"], 200),
    disposition: str(report.disposition, 8),
  };
}

export function normalizeCspReports(
  raw: unknown,
  contentType: string,
): NormalizedCspReport[] {
  if (contentType.includes("application/csp-report")) {
    const obj = (raw as { "csp-report"?: Record<string, unknown> })?.["csp-report"];
    return obj ? [fromLegacy(obj)] : [];
  }
  if (Array.isArray(raw)) {
    return raw
      .filter((r) => (r as { type?: string }).type === "csp-violation")
      .map((r) => fromReportingApi(((r as { body?: Record<string, unknown> }).body) ?? {}));
  }
  return [];
}

/** Origin only (or a literal like `inline`/`eval`). Drops path + query (token risk). */
function reduceBlocked(blockedUrl: string): string {
  if (!blockedUrl) return "unknown";
  try {
    return new URL(blockedUrl).origin;
  } catch {
    return blockedUrl.slice(0, 48); // "inline", "eval", "data", …
  }
}

/** Origin + pathname, query stripped. Empty → null. */
function reduceSourceFile(sourceFile: string): string | null {
  if (!sourceFile) return null;
  try {
    const u = new URL(sourceFile);
    return `${u.origin}${u.pathname}`;
  } catch {
    return sourceFile.slice(0, 256);
  }
}

function redactSnippet(sample: string): string | null {
  if (!sample) return null;
  const redacted = sample
    .replace(/[\w.+-]+@[\w.-]+\.\w+/g, "[email]")
    .slice(0, 60);
  return redacted || null;
}

export function sanitizeCspReport(
  report: NormalizedCspReport,
  surface: string,
): SanitizedCspReport | null {
  if (isExtensionNoise(report.blockedUrl)) return null;
  if (!report.directive) return null;

  let documentPath = "/";
  try {
    documentPath = collapseRoute(new URL(report.documentUrl).pathname);
  } catch {
    documentPath = collapseRoute(report.documentUrl.split("?")[0] || "/");
  }

  return {
    surface,
    disposition: report.disposition === "enforce" ? "enforce" : "report",
    directive: report.directive,
    documentPath,
    blockedSource: reduceBlocked(report.blockedUrl),
    sampleSourceFile: reduceSourceFile(report.sourceFile),
    sampleLine: report.line,
    sampleSnippet: redactSnippet(report.snippet),
  };
}
```

- [ ] **Step 4: Add the subpath export**

In `code/packages/shared/security/package.json`, add a `"./csp-report"` entry to the `exports` map, mirroring the existing `"./crypto"` entry (point it at `./src/csp-report.ts`). Do not add a tsconfig `paths` entry — this brick uses explicit-extension subpath exports.

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm --filter @indiecrafts/packages-shared-security test csp-report`
Expected: PASS (all cases green).

- [ ] **Step 6: Commit**

```bash
git add code/packages/shared/security/src/csp-report.ts code/packages/shared/security/src/csp-report.test.ts code/packages/shared/security/package.json
git commit -m "feat(security): normalize + sanitize CSP violation reports

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: New brick — `@indiecrafts/packages-web-security-reports`

The Next route glue and the server-only forwarder. Depends on the security brick for the pure parsing.

**Files:**
- Create: `code/packages/web/security-reports/package.json`
- Create: `code/packages/web/security-reports/src/handle.ts`
- Create: `code/packages/web/security-reports/src/forward.ts`
- Create: `code/packages/web/security-reports/src/handle.test.ts`
- Create: `code/packages/web/security-reports/.claude/CLAUDE.md`
- Modify: `code/packages/_registry.md`
- Create: `code/docs/packages/security-reports.md`
- Modify: `code/docs/.vitepress/config.mts`
- Modify: `code/packages/CHANGELOG.md`

**Interfaces:**
- Consumes (Task 2): `normalizeCspReports`, `sanitizeCspReport`, `type SanitizedCspReport` from `@indiecrafts/packages-shared-security/csp-report`.
- Produces: `handleCspReport(request: Request, opts: { surface: string }): Promise<Response>` (import: `@indiecrafts/packages-web-security-reports/handle`)
- Produces: `forwardCspReports(reports: SanitizedCspReport[]): Promise<void>` (import: `@indiecrafts/packages-web-security-reports/forward`)

- [ ] **Step 1: Create the package manifest**

Create `code/packages/web/security-reports/package.json`:

```json
{
  "name": "@indiecrafts/packages-web-security-reports",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./handle": "./src/handle.ts",
    "./forward": "./src/forward.ts"
  },
  "scripts": {
    "test": "vitest run"
  },
  "dependencies": {
    "@indiecrafts/packages-shared-security": "workspace:*"
  }
}
```

Explicit per-file exports (not a `./*` wildcard) — so no consuming app needs a tsconfig `paths` entry.

- [ ] **Step 2: Write the forwarder**

Create `code/packages/web/security-reports/src/forward.ts`:

```ts
import "server-only";
import type { SanitizedCspReport } from "@indiecrafts/packages-shared-security/csp-report";

/**
 * Forward sanitized CSP reports to the api's POST /v1/events (kind:csp-report).
 * Server-only: holds APP_API_TOKEN, never runs in the browser. Fire-and-forget.
 * Batches of 10 keep each request under the worker's 4000-byte body cap.
 */
export async function forwardCspReports(
  reports: SanitizedCspReport[],
): Promise<void> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token || reports.length === 0) return;
  for (let i = 0; i < reports.length; i += 10) {
    const batch = reports.slice(i, i + 10);
    try {
      await fetch(`${url}/v1/events`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ kind: "csp-report", reports: batch }),
      });
    } catch {
      // fire-and-forget
    }
  }
}
```

- [ ] **Step 3: Write the route handler**

Create `code/packages/web/security-reports/src/handle.ts`:

```ts
import {
  normalizeCspReports,
  sanitizeCspReport,
  type SanitizedCspReport,
} from "@indiecrafts/packages-shared-security/csp-report";
import { forwardCspReports } from "./forward";

const ACCEPTED = ["application/reports+json", "application/csp-report"];
const MAX_BODY = 64 * 1024;
const MAX_REPORTS = 50;

/**
 * Same-origin CSP report sink. The browser POSTs violations here with no auth, so
 * this route is the trust boundary: accept only the CSP content-types, cap the body,
 * normalize + sanitize, drop noise, then forward the survivors with the bearer token.
 * Always answers 204 — it never reflects input or leaks validation detail.
 */
export async function handleCspReport(
  request: Request,
  opts: { surface: string },
): Promise<Response> {
  const noContent = () => new Response(null, { status: 204 });
  const contentType = request.headers.get("content-type") ?? "";
  if (!ACCEPTED.some((t) => contentType.includes(t)))
    return new Response(null, { status: 415 });

  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY)
    return new Response(null, { status: 413 });

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return noContent();
  }

  const sanitized = normalizeCspReports(raw, contentType)
    .slice(0, MAX_REPORTS)
    .map((r) => sanitizeCspReport(r, opts.surface))
    .filter((r): r is SanitizedCspReport => r !== null);

  if (sanitized.length > 0) await forwardCspReports(sanitized);
  return noContent();
}
```

- [ ] **Step 4: Write the failing test**

Create `code/packages/web/security-reports/src/handle.test.ts`. Mock `./forward` so `server-only` is never imported in the test runtime:

```ts
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
```

- [ ] **Step 5: Run test to verify it fails, then passes**

Run: `pnpm --filter @indiecrafts/packages-web-security-reports test`
Expected: first run FAILS if the brick is not yet resolvable (run `pnpm install` once so the workspace picks up the new package), then PASSES after Steps 1-4 are in place.

If the runner cannot resolve `@indiecrafts/packages-shared-security/csp-report`, run `pnpm install` at the repo root to link the new workspace member, then re-run.

- [ ] **Step 6: Write the brick brief**

Create `code/packages/web/security-reports/.claude/CLAUDE.md` — a short brief in the shape of the sibling briefs (`code/packages/web/compliance/.claude/CLAUDE.md`): name, one-line purpose (the CSP report sink + forwarder), the two exports, its single dep, and the note that pure parsing lives in `@indiecrafts/packages-shared-security/csp-report`.

- [ ] **Step 7: Register the brick, doc, sidebar, changelog**

- Add a row for `@indiecrafts/packages-web-security-reports` to `code/packages/_registry.md` (category: domain; scope: web).
- Create `code/docs/packages/security-reports.md` (exports · deps · consumers · the 3-hop flow), following the shape of `code/docs/packages/security.md`.
- Add one sidebar line under the Packages group in `code/docs/.vitepress/config.mts`.
- Add an entry to `code/packages/CHANGELOG.md` under `## [Unreleased] / ### Added`.

- [ ] **Step 8: Commit**

```bash
git add code/packages/web/security-reports code/packages/_registry.md code/docs/packages/security-reports.md code/docs/.vitepress/config.mts code/packages/CHANGELOG.md pnpm-lock.yaml
git commit -m "feat(security-reports): CSP report sink + forwarder brick

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: API worker — `csp_reports` table + `kind:csp-report` branch

The migration and the worker branch are tested together (the branch test needs the table), so they are one task.

**Files:**
- Create: `code/shared/api/db/d1/migrations/0004_csp_reports.sql`
- Modify: `code/shared/api/src/index.ts` (add the branch after the `consent` branch, before the final `else`)
- Modify: `code/shared/api/src/index.test.ts` (or the colocated worker test file; create a `csp-report` test)
- Modify: `code/shared/api/CHANGELOG.md`

**Interfaces:**
- Consumes: forwarded body `{ kind: "csp-report", reports: SanitizedCspReport[] }` from Task 3's `forwardCspReports`.
- Produces: rows in `csp_reports`, keyed by `group_key = surface|disposition|directive|document_path|blocked_source`.

- [ ] **Step 1: Write the migration**

Create `code/shared/api/db/d1/migrations/0004_csp_reports.sql`:

```sql
-- Aggregated CSP violation reports. Forward-only (D1 has no down-migrations).
-- One row per distinct violation GROUP (surface|disposition|directive|path|source),
-- with a running count — not one row per report. Bounds table size by distinct
-- violations, not request volume. Purged after 30 days by the cron worker.
-- Data-minimized: NO country, NO ip_hash — a CSP violation is about a resource,
-- not a person. Routes are collapsed (/orders/:id) and samples redacted upstream.
CREATE TABLE csp_reports (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  group_key          TEXT NOT NULL UNIQUE,   -- surface|disposition|directive|path|source
  first_seen         TEXT NOT NULL,          -- ISO8601
  last_seen          TEXT NOT NULL,          -- ISO8601; drives the 30-day purge
  count              INTEGER NOT NULL DEFAULT 1,
  surface            TEXT NOT NULL,          -- website | admin | app
  disposition        TEXT NOT NULL,          -- report | enforce
  directive          TEXT NOT NULL,          -- effectiveDirective, e.g. script-src-elem
  document_path      TEXT NOT NULL,          -- collapsed route, e.g. /orders/:id
  blocked_source     TEXT NOT NULL,          -- origin | inline | eval
  sample_source_file TEXT,                    -- last-seen, query stripped
  sample_line        INTEGER,
  sample_snippet     TEXT                     -- last-seen, redacted
);
CREATE INDEX idx_csp_reports_last_seen ON csp_reports (last_seen);   -- for the purge
CREATE INDEX idx_csp_reports_group     ON csp_reports (surface, directive);
```

- [ ] **Step 2: Write the failing test**

Add a `csp-report` case to the worker test (`code/shared/api/src/index.test.ts`), following the existing consent-branch test pattern (it uses `vitest-pool-workers` with the migrated D1 bound as `env.DB` and `env.APP_API_TOKEN` set). If the exact helper names differ, mirror the existing `kind:consent` test in the same file. **If the api worker has no colocated test file yet**, create `code/shared/api/src/index.test.ts` and model the `vitest-pool-workers` setup on `code/shared/cron/src/index.test.ts` (same runtime, same D1-migration auto-apply) — the D1 bindings + migration dir are declared in `code/shared/api/wrangler.toml`.

```ts
it("kind:csp-report upserts an aggregated row and increments count", async () => {
  const send = (reports: unknown[]) =>
    worker.fetch(
      new Request("https://api.test/v1/events", {
        method: "POST",
        headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
        body: JSON.stringify({ kind: "csp-report", reports }),
      }),
      env,
      ctx,
    );

  const one = {
    surface: "website",
    disposition: "report",
    directive: "img-src",
    documentPath: "/orders/:id",
    blockedSource: "https://evil.example",
    sampleSourceFile: "https://x.dev/p",
    sampleLine: 4,
    sampleSnippet: "x",
  };

  expect((await send([one])).status).toBe(201);
  expect((await send([one])).status).toBe(201);

  const row = await env.DB.prepare(
    "SELECT count, document_path FROM csp_reports WHERE group_key = ?",
  )
    .bind("website|report|img-src|/orders/:id|https://evil.example")
    .first<{ count: number; document_path: string }>();
  expect(row?.count).toBe(2);
  expect(row?.document_path).toBe("/orders/:id");
});

it("kind:csp-report with an empty array is 400", async () => {
  const res = await worker.fetch(
    new Request("https://api.test/v1/events", {
      method: "POST",
      headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({ kind: "csp-report", reports: [] }),
    }),
    env,
    ctx,
  );
  expect(res.status).toBe(400);
});
```

Reuse the file's existing constants for `worker`, `env`, `ctx`, `TOKEN`. Ensure the test setup applies migration `0004` (the pool-workers config auto-applies `db/d1/migrations` — confirm `0004` is present in that dir).

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-api test`
Expected: FAIL — the `csp-report` kind hits the final `else` → 400 for the valid batch, or the table does not exist.

- [ ] **Step 4: Add the worker branch**

In `code/shared/api/src/index.ts`, insert a new branch after the `consent` branch (line ~447, after its closing `}`) and before the final `} else {` (line ~448):

```ts
        } else if (body.kind === "csp-report") {
          // CSP violations, sanitized upstream by the surface route (routes
          // collapsed, tokens stripped, samples redacted). Aggregate on write:
          // one row per distinct group, count incremented. No IP/country — a CSP
          // violation is about a resource, not a subject.
          if (!env.DB) return json({ error: "unavailable" }, 503, cors);
          const reports = Array.isArray(body.reports)
            ? body.reports.slice(0, 10)
            : [];
          if (reports.length === 0)
            return json({ error: "invalid" }, 400, cors);
          for (const raw of reports as Array<Record<string, unknown>>) {
            const surface = str(raw.surface, 16);
            const disposition =
              str(raw.disposition, 8) === "enforce" ? "enforce" : "report";
            const directive = str(raw.directive, 48);
            const documentPath = str(raw.documentPath, 256);
            const blockedSource = str(raw.blockedSource, 256);
            if (!surface || !directive || !documentPath || !blockedSource)
              continue;
            const groupKey = `${surface}|${disposition}|${directive}|${documentPath}|${blockedSource}`;
            const sampleSourceFile = str(raw.sampleSourceFile, 256) || null;
            const sampleLine =
              typeof raw.sampleLine === "number" ? raw.sampleLine : null;
            const sampleSnippet = str(raw.sampleSnippet, 60) || null;
            await env.DB.prepare(
              "INSERT INTO csp_reports (group_key, first_seen, last_seen, count, surface, disposition, directive, document_path, blocked_source, sample_source_file, sample_line, sample_snippet) " +
                "VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?) " +
                "ON CONFLICT(group_key) DO UPDATE SET count = count + 1, last_seen = excluded.last_seen, sample_source_file = excluded.sample_source_file, sample_line = excluded.sample_line, sample_snippet = excluded.sample_snippet",
            )
              .bind(
                groupKey,
                ts,
                ts,
                surface,
                disposition,
                directive,
                documentPath,
                blockedSource,
                sampleSourceFile,
                sampleLine,
                sampleSnippet,
              )
              .run();
          }
        } else {
```

`str` and `ts` are already in scope inside the `/v1/events` block.

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @indiecrafts/shared-api test`
Expected: PASS (both new cases green; existing branch tests still green).

- [ ] **Step 6: Update the api CHANGELOG and DB comment**

- Add a `### Added` entry to `code/shared/api/CHANGELOG.md`: the `kind:csp-report` branch + the `0004_csp_reports` migration, with the _why_ (report-only CSP collection).
- Update the `Env.DB` comment in `code/shared/api/src/index.ts` (line ~53-54) to list `csp_reports` among the tables.

- [ ] **Step 7: Commit**

```bash
git add code/shared/api/db/d1/migrations/0004_csp_reports.sql code/shared/api/src/index.ts code/shared/api/src/index.test.ts code/shared/api/CHANGELOG.md
git commit -m "feat(api): kind:csp-report writes aggregated csp_reports (migration 0004)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Cron — 30-day `csp_reports` purge

**Files:**
- Modify: `code/shared/cron/src/index.ts`
- Modify: `code/shared/cron/src/retention.test.ts` (or the colocated retention test)
- Modify: `code/shared/cron/CHANGELOG.md`

**Interfaces:**
- Consumes: the `csp_reports` table (Task 4), purged on `last_seen`.

- [ ] **Step 1: Write the failing test**

Add a case to `code/shared/cron/src/retention.test.ts` mirroring the existing consent/audit purge tests: seed one `csp_reports` row with `last_seen` 31 days ago and one 1 day ago, run `scheduled`, assert the old row is gone and the fresh one remains. Use the file's existing D1 setup and `scheduled` invocation. Example assertion:

```ts
it("purges csp_reports older than 30 days on last_seen", async () => {
  const old = new Date(NOW - 31 * 86_400_000).toISOString();
  const fresh = new Date(NOW - 1 * 86_400_000).toISOString();
  await seedCspReport("website|report|img-src|/a|https://x", old);
  await seedCspReport("website|report|img-src|/b|https://y", fresh);

  await runScheduled(NOW);

  const { results } = await env.DB.prepare("SELECT group_key FROM csp_reports").all();
  expect(results.map((r) => r.group_key)).toEqual(["website|report|img-src|/b|https://y"]);
});
```

Define `seedCspReport`/`runScheduled`/`NOW` to match the helpers already in the file (mirror how the consent purge test seeds and runs). Ensure the cron test's D1 includes the `0004` migration.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @indiecrafts/shared-cron test`
Expected: FAIL — `csp_reports` rows are not purged (no DELETE yet).

- [ ] **Step 3: Add the retention constant and the purge**

In `code/shared/cron/src/index.ts`:

Add the constant after `CONSENT_RETENTION_DAYS` (line ~32):

```ts
/** CSP violation reports are operational signal, not a proof record — 30 days. */
const CSP_RETENTION_DAYS = 30;
```

In the `scheduled` handler, add the cutoff beside the others (after line ~59):

```ts
    const cspCutoff = retentionCutoff(
      controller.scheduledTime,
      CSP_RETENTION_DAYS,
    );
```

Inside the `if (env.DB)` try block, after the `consent` delete (line ~81), add:

```ts
        const csp = await env.DB.prepare(
          "DELETE FROM csp_reports WHERE last_seen < ?",
        )
          .bind(cspCutoff)
          .run();
```

Add `cspCutoff` and `cspRows: csp.meta?.changes` to the `logger.info("retention purge", {...})` payload.

Update the `Env.DB` comment (line ~21-24) to include `csp_reports` in the table list.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @indiecrafts/shared-cron test`
Expected: PASS.

- [ ] **Step 5: Update the cron CHANGELOG**

Add a `### Added` entry to `code/shared/cron/CHANGELOG.md`: the 30-day `csp_reports` purge, with the _why_.

- [ ] **Step 6: Commit**

```bash
git add code/shared/cron/src/index.ts code/shared/cron/src/retention.test.ts code/shared/cron/CHANGELOG.md
git commit -m "feat(cron): purge csp_reports after 30 days

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Website — enable CSP reporting + the report route

**Files:**
- Modify: `code/projects/web/surfaces/website/next.config.ts`
- Modify: `code/projects/web/surfaces/website/package.json` (add the brick dep)
- Create: `code/projects/web/surfaces/website/src/app/api/csp-report/route.ts`

**Interfaces:**
- Consumes: `handleCspReport` (Task 3); `securityHeaders` `reporting` option (Task 1).

- [ ] **Step 1: Add the brick to transpile + deps**

- In `code/projects/web/surfaces/website/next.config.ts`, add `"@indiecrafts/packages-web-security-reports"` to the `transpilePackages` array.
- In `code/projects/web/surfaces/website/package.json`, add `"@indiecrafts/packages-web-security-reports": "workspace:*"` to `dependencies`. Run `pnpm install`.

- [ ] **Step 2: Enable reporting in `headers()`**

In `code/projects/web/surfaces/website/next.config.ts`, add a `reporting` field to the `securityHeaders({...})` call (inside the existing `headers()`):

```ts
      reporting: {
        endpoint: "/api/csp-report",
        // First Report-Only candidate: drop the blanket `https:` from img-src to
        // learn the real image allowlist (Sanity, etc.) before enforcing it.
        // Tighten further during rollout; nonces for script-src come in SP3.
        reportOnly: { dropSources: ["https:"] },
      },
```

- [ ] **Step 3: Add the route**

Create `code/projects/web/surfaces/website/src/app/api/csp-report/route.ts`:

```ts
import { handleCspReport } from "@indiecrafts/packages-web-security-reports/handle";

// The browser POSTs CSP violations here (report-to / report-uri). No auth: the
// handler sanitizes and forwards with the server-held token. See the security-reports brick.
export function POST(request: Request) {
  return handleCspReport(request, { surface: "website" });
}
```

- [ ] **Step 4: Verify the build and the header**

Run: `pnpm --filter @indiecrafts/web-surfaces-website build`
Expected: build succeeds.

Manual check (dev): start the app (`pnpm dev`), then in a terminal:

Run: `curl -sI http://localhost:3000/en | grep -i -E "reporting-endpoints|report-only"`
Expected: a `Reporting-Endpoints: csp-endpoint="/api/csp-report"` line and a `Content-Security-Policy-Report-Only` line are present.

Post a sample report:

Run: `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/csp-report -H "content-type: application/reports+json" -d '[{"type":"csp-violation","body":{"effectiveDirective":"img-src","documentURL":"http://localhost:3000/en/x/5","blockedURL":"https://evil.example/a.png","disposition":"report"}}]'`
Expected: `204`.

- [ ] **Step 5: Update website docs + changelog**

- Update `code/docs/apps/web/seo/security-headers.md`: reporting is on, the Report-Only candidate, the `/api/csp-report` route.
- Add an entry to `code/projects/web/surfaces/website/CHANGELOG.md` with the _why_.

- [ ] **Step 6: Commit**

```bash
git add code/projects/web/surfaces/website/next.config.ts code/projects/web/surfaces/website/package.json code/projects/web/surfaces/website/src/app/api/csp-report/route.ts code/docs/apps/web/seo/security-headers.md code/projects/web/surfaces/website/CHANGELOG.md pnpm-lock.yaml
git commit -m "feat(website): enable CSP reporting + /api/csp-report route

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Admin — security headers + the report route

Admin ships no security headers today. This adds the first `securityHeaders()` call there plus the report route. The route MUST be reachable without a session.

**Files:**
- Modify: `code/projects/web/surfaces/admin/next.config.ts`
- Modify: `code/projects/web/surfaces/admin/package.json`
- Create: `code/projects/web/surfaces/admin/src/app/api/csp-report/route.ts`
- Modify (if needed): `code/projects/web/surfaces/admin/src/proxy.ts`

**Interfaces:**
- Consumes: `securityHeaders` + `reporting` (Task 1); `handleCspReport` (Task 3).

- [ ] **Step 1: Confirm the admin package name and gate**

Run: `grep '"name"' code/projects/web/surfaces/admin/package.json`
Note the package name (expected `@indiecrafts/web-surfaces-admin`) — use it in the commands below.

Read `code/projects/web/surfaces/admin/src/proxy.ts` and its `matcher`. Confirm `/api/*` is excluded from the matcher (like the website proxy, which excludes `api|_next|...`). If `api` is NOT excluded, add it to the matcher so `/api/csp-report` is never gated or locale-rewritten. The `(dashboard)` group layout gate applies only to pages under that group, not to `/api/*` — do not gate the report route.

- [ ] **Step 2: Add the two bricks to transpile + deps**

- In `code/projects/web/surfaces/admin/next.config.ts`, ensure `transpilePackages` includes both `"@indiecrafts/packages-shared-security"` (already present) and `"@indiecrafts/packages-web-security-reports"` (add it).
- In `code/projects/web/surfaces/admin/package.json`, add `"@indiecrafts/packages-web-security-reports": "workspace:*"` (and `"@indiecrafts/packages-shared-security": "workspace:*"` if absent). Run `pnpm install`.

- [ ] **Step 3: Add `headers()` to the admin next.config**

In `code/projects/web/surfaces/admin/next.config.ts`, import and add an `async headers()` (admin has none today). Import at the top:

```ts
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
import { securityHeaders } from "@indiecrafts/packages-shared-security";
```

Add inside the config object:

```ts
  async headers() {
    // First security headers on admin: hardened CSP + reporting. Admin loads no
    // third-party media, so no extra hosts. The Report-Only candidate drops the
    // blanket img-src `https:` to learn the real allowlist.
    return securityHeaders({
      env: getCurrentEnvironment(),
      reporting: {
        endpoint: "/api/csp-report",
        reportOnly: { dropSources: ["https:"] },
      },
    });
  },
```

- [ ] **Step 4: Add the route**

Create `code/projects/web/surfaces/admin/src/app/api/csp-report/route.ts`:

```ts
import { handleCspReport } from "@indiecrafts/packages-web-security-reports/handle";

export function POST(request: Request) {
  return handleCspReport(request, { surface: "admin" });
}
```

- [ ] **Step 5: Verify build + route reachability**

Run: `pnpm --filter @indiecrafts/web-surfaces-admin build`
Expected: build succeeds.

Manual (dev): start admin, then confirm the report route answers without a session:

Run: `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/csp-report -H "content-type: application/csp-report" -d '{"csp-report":{"effective-directive":"img-src","document-uri":"http://localhost:3000/x","blocked-uri":"https://evil.example/a.png","disposition":"report"}}'`
Expected: `204` (NOT a 3xx redirect to sign-in). If it redirects, the proxy matcher still gates `/api` — fix Step 1.

- [ ] **Step 6: Changelog**

Add an entry to `code/projects/web/surfaces/admin/CHANGELOG.md` (create the `## [Unreleased]` section if the file lacks one): first security headers + CSP reporting, with the _why_.

- [ ] **Step 7: Commit**

```bash
git add code/projects/web/surfaces/admin pnpm-lock.yaml
git commit -m "feat(admin): security headers + CSP report route

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: App — security headers + the report route

The `app` surface transpiles neither brick and has no `headers()`. This wires both.

**Files:**
- Modify: `code/projects/web/surfaces/app/next.config.ts`
- Modify: `code/projects/web/surfaces/app/package.json`
- Create: `code/projects/web/surfaces/app/src/app/api/csp-report/route.ts`
- Modify (if needed): `code/projects/web/surfaces/app/src/proxy.ts`

**Interfaces:**
- Consumes: `securityHeaders` + `reporting` (Task 1); `handleCspReport` (Task 3).

- [ ] **Step 1: Confirm the app package name, gate, and route dir**

Run: `grep '"name"' code/projects/web/surfaces/app/package.json`
Note the package name (expected `@indiecrafts/web-surfaces-app`).

Read `code/projects/web/surfaces/app/src/proxy.ts` and confirm `/api/*` is excluded from its matcher; add it if not. Confirm the app uses the App Router with an `src/app/` dir and a `[locale]` segment (mirror how website/admin lay out `src/app/api`). If the app's route dir differs, place the route file at the app's `app/api/csp-report/route.ts` equivalent.

- [ ] **Step 2: Add both bricks to transpile + deps**

- In `code/projects/web/surfaces/app/next.config.ts`, add `"@indiecrafts/packages-shared-security"` AND `"@indiecrafts/packages-web-security-reports"` to `transpilePackages`.
- In `code/projects/web/surfaces/app/package.json`, add both as `"workspace:*"` deps. Run `pnpm install`.

- [ ] **Step 3: Add `headers()` to the app next.config**

Mirror Task 7 Step 3 exactly (same import + `async headers()` block with `reporting`), in `code/projects/web/surfaces/app/next.config.ts`.

- [ ] **Step 4: Add the route**

Create `code/projects/web/surfaces/app/src/app/api/csp-report/route.ts`:

```ts
import { handleCspReport } from "@indiecrafts/packages-web-security-reports/handle";

export function POST(request: Request) {
  return handleCspReport(request, { surface: "app" });
}
```

- [ ] **Step 5: Verify build**

Run: `pnpm --filter @indiecrafts/web-surfaces-app build`
Expected: build succeeds.

- [ ] **Step 6: Changelog**

Add an entry to `code/projects/web/surfaces/app/CHANGELOG.md` (create `## [Unreleased]` if absent): first security headers + CSP reporting.

- [ ] **Step 7: Commit**

```bash
git add code/projects/web/surfaces/app pnpm-lock.yaml
git commit -m "feat(app): security headers + CSP report route

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: Docs — the security package reference

Finish the docs the earlier tasks touched only in their own areas: the `security` package page (new reporting API) and a final read of the two narrative pages.

**Files:**
- Modify: `code/docs/packages/security.md`
- Verify: `code/docs/apps/web/seo/security-headers.md` (edited in Task 6 — confirm it reads whole)
- Verify: `code/docs/.vitepress/config.mts` (the `security-reports` sidebar line from Task 3)

- [ ] **Step 1: Document the reporting API**

In `code/docs/packages/security.md`, document the new options and functions: `securityHeaders({ reporting })`, `buildCsp(env, csp, reporting)`, `buildReportOnlyCsp`, `CspReporting`, and the `./csp-report` functions (`normalizeCspReports`, `sanitizeCspReport`, `collapseRoute`, `isExtensionNoise`). Add a one-line pointer to the sibling `security-reports.md` page.

- [ ] **Step 2: Read both pages end to end**

Read `code/docs/packages/security.md` and `code/docs/apps/web/seo/security-headers.md` in full. Confirm no dangling reference, no half-sentence, and that the described behavior matches the code (Report-Only candidate = enforced minus `dropSources`; 30-day retention; no IP/country stored).

- [ ] **Step 3: Build the docs site**

Run: `pnpm docs:build`
Expected: build succeeds (no broken links, sidebar resolves).

- [ ] **Step 4: Commit**

```bash
git add code/docs/packages/security.md code/docs/apps/web/seo/security-headers.md code/docs/.vitepress/config.mts
git commit -m "docs(security): CSP reporting + report-sink reference

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Final verification

After Task 9, run the full gate once:

- `pnpm tsc` — strict, all workspaces.
- `pnpm --filter @indiecrafts/packages-shared-security test`
- `pnpm --filter @indiecrafts/packages-web-security-reports test`
- `pnpm --filter @indiecrafts/shared-api test`
- `pnpm --filter @indiecrafts/shared-cron test`
- `pnpm lint`

Then a live end-to-end check on website (dev): load a page, force a violation (e.g. an inline `<img src="https://placekitten.com/1/1">` on a test route), and confirm a `csp_reports` row appears with `document_path` collapsed and `disposition = "report"`.

## Spec coverage self-review

- Headers (reporting on enforced + Report-Only candidate, all surfaces) → Tasks 1, 6, 7, 8.
- Normalize + sanitize + noise drop → Task 2.
- Route glue + forwarder brick → Task 3.
- Storage (aggregate-on-write, no country/ip_hash) → Task 4.
- Worker branch → Task 4.
- Cron 30-day purge → Task 5.
- Security hardening (POST-only, content-type allowlist, 64 KB cap, no reflection, admin gate) → Task 3 (handler) + Task 7 Step 1/5.
- Testing plan → the test step in Tasks 1-5.
- Docs + changelogs → each task's doc/changelog step + Task 9.
- Out of scope (admin dashboard SP2, enforcement SP3) → not in this plan, by design.
