/**
 * Receive browser CSP violation reports and forward them server-side.
 *
 * @see docs/reference/projects/web/app/src/app/api/csp-report/route.md
 */
import { handleCspReport } from "@indiecrafts/packages-web-security-reports/handle";

// The browser POSTs CSP violations here (report-to / report-uri). No auth: the
// handler sanitizes and forwards with the server-held token. See the security-reports brick.
export function POST(request: Request) {
  return handleCspReport(request, { surface: "app" });
}
