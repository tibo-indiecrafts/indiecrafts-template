# @indiecrafts/packages-web-security-reports — CSP report sink + forwarder

**Stack:** TypeScript. The Next route glue + the server-only forwarder for browser CSP violation
reports. Domain · web. Dep: `@indiecrafts/packages-shared-security` (workspace:*).

Auto-loads under `code/packages/web/security-reports/**`. Explicit per-file `exports` (`./handle`,
`./forward`) — no tsconfig `paths` entry needed in a consuming app.

- **`handleCspReport(request, opts: { surface })`** (`./handle`) — the same-origin route handler.
  The browser POSTs violations here with no auth, so this is the trust boundary: accepts only the
  CSP content-types (`application/reports+json`, `application/csp-report`), caps the body at 64KB,
  keeps at most 50 reports per request, then normalizes + sanitizes + drops extension noise before
  forwarding survivors. Always answers 204 — never reflects input or leaks validation detail.
- **`forwardCspReports(reports)`** (`./forward`) — `import "server-only"`; posts sanitized reports
  to the api's `POST /v1/events` (`kind: "csp-report"`) in batches of 10, bearer-authed with
  `APP_API_TOKEN`. Fire-and-forget: no-ops without `API_URL`/`APP_API_TOKEN`, swallows fetch errors.

**Pure parsing lives in `@indiecrafts/packages-shared-security/csp-report`** —
`normalizeCspReports`/`sanitizeCspReport`/`SanitizedCspReport`. This brick is the Next-coupled glue
around it: `server-only` import in `forward.ts` is why the brick can't move to `shared/`.

Full reference → [`code/docs/packages/security-reports.md`](../../../../docs/packages/security-reports.md).
