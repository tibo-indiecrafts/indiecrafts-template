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
