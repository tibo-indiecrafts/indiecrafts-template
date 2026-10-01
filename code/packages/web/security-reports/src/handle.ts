/**
 * Handle same-origin CSP violation reports at the trust boundary.
 *
 * @see docs/reference/packages/web/security-reports/src/handle.md
 */
import {
  normalizeCspReports,
  sanitizeCspReport,
  type SanitizedCspReport,
} from "@indiecrafts/packages-shared-security/csp-report";
import { clientIp } from "@indiecrafts/packages-shared-security/guard";
import { rateLimit } from "@indiecrafts/packages-shared-security/rate-limit";
import { forwardCspReports } from "./forward";

const ACCEPTED = ["application/reports+json", "application/csp-report"];
const MAX_BODY = 64 * 1024;
const MAX_REPORTS = 50;
// In-app fixed-window fallback per client IP + surface — defence-in-depth on the
// anonymous sink (the CF WAF rule on /api/* is primary; this no-ops without
// RATE_LIMIT_KV). Generous: one page's whole batch is a single request (capped at
// MAX_REPORTS), so 30/min/IP stops table-inflation spam without dropping real bursts.
const RATE_LIMIT = { limit: 30, windowSec: 60 };

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

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY)
    return new Response(null, { status: 413 });

  // Backpressure before we read the body — a spammer can't inflate the table.
  const ip = clientIp(request);
  const { ok } = await rateLimit(
    `csp:${opts.surface}:${ip}`,
    RATE_LIMIT.limit,
    RATE_LIMIT.windowSec,
  );
  if (!ok) return new Response(null, { status: 429 });

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

  if (sanitized.length > 0) await forwardCspReports(sanitized, ip);
  return noContent();
}
