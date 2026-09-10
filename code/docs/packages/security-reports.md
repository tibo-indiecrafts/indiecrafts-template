# Security reports (CSP report sink + forwarder)

The Next route glue for browser CSP violation reports. Lives in the
**`@indiecrafts/packages-web-security-reports`** brick (`code/packages/web/security-reports`), consumed
as source. Depends on `@indiecrafts/packages-shared-security` (workspace:*), which owns the pure
parsing (`normalizeCspReports`/`sanitizeCspReport`, `./csp-report` — see
[`security.md`](./security)).

## Exports

| Import                                        | What it is                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handleCspReport(request, opts)` (`./handle`) | The route handler. `opts = { surface: string }`. Accepts only the CSP content-types, caps the body at 64KB, **rate-limits per client IP** (30/min — defence-in-depth on the anonymous sink; no-ops without `RATE_LIMIT_KV`), keeps at most 50 reports, normalizes + sanitizes + drops extension noise, forwards the survivors. Answers `204` (or `429` over the limit). |
| `forwardCspReports(reports)` (`./forward`)    | `import "server-only"`. Posts sanitized reports to the api's `POST /v1/events` (`kind: "csp-report"`) in batches of 5, bearer-authed with `APP_API_TOKEN`. Fire-and-forget: no-ops without `API_URL`/`APP_API_TOKEN`, swallows fetch errors.                                                                                                                            |

Explicit per-file `exports` (`./handle`, `./forward`) — a consuming app needs no tsconfig `paths`
entry.

## The 3-hop flow

1. **Browser → route.** The browser POSTs a CSP violation report to the site's report endpoint with
   no auth, so the route is the trust boundary. `handleCspReport` rejects a non-CSP content-type
   (`415`), an oversized body (`413`), and a per-IP flood (`429`, keyed on the trusted `clientIp` —
   `RATE_LIMIT_KV` fallback, the CF WAF rule is primary) before parsing anything.
2. **Route → brick.** The route calls `normalizeCspReports` (collapses the two browser report
   formats — Reporting API `application/reports+json` and legacy `application/csp-report` — into one
   shape) then `sanitizeCspReport` per report (drops browser-extension noise, reduces URLs to origin,
   collapses dynamic route segments, redacts emails from the snippet). `handleCspReport` never
   reflects input back to the caller — it always answers `204`, even on a parse failure.
3. **Brick → api.** Surviving `SanitizedCspReport`s go to `forwardCspReports`, which batches them
   (5 per request, under the worker's 4000-byte body cap) and POSTs to the api's `/v1/events` with
   `kind: "csp-report"`.

## Using it (a Next route)

```ts
// app/api/csp-report/route.ts
import { handleCspReport } from "@indiecrafts/packages-web-security-reports/handle";

export async function POST(request: Request) {
  return handleCspReport(request, { surface: "website" });
}
```

## Not the parsing brick

This brick holds only the Next-coupled glue — the route trust boundary and the `server-only`
forwarder. The pure, framework-free parsing (`normalizeCspReports`, `sanitizeCspReport`,
`SanitizedCspReport`) lives in `@indiecrafts/packages-shared-security/csp-report`, so it can be
reused outside a Next route if a second surface ever needs it.
