# API security limits

The per-route request-boundary policy for the public API — one home for every rate-limit, body cap,
and bot-check so the security posture is reviewable in one place. Lives in
`code/projects/web/surfaces/website/src/config/security.ts`, imported via `@/config`, like
[feature flags](./feature-flags).

## Why it's here

Each public POST is hardened by `withGuard` (`@indiecrafts/security` — see
[Security headers](../../../packages/security)), which takes its limits as options. Those options used
to be inline literals in every `route.ts`, so `windowSec: 600` and the body-cap tiers were copied
across six routes. Centralizing them gives **one home per fact** and a single place to review or tune
the whole API's abuse policy. It's app-owned (a second app ships its own limits), not in the shared
`@indiecrafts/config` package.

## The policy

`src/config/security.ts` — a flat `as const` object, one key per guarded route:

| Route | limit / window | bodyMax | Turnstile |
| --- | --- | --- | --- |
| `newsletter` — `/api/newsletter` | 5 / 600s | 8000 | yes |
| `waitlist` — `/api/waitlist` | 5 / 600s | 8000 | yes |
| `comments` — `/api/comments` | 8 / 600s | 12000 | yes |
| `dataRequest` — `/api/data-request` | 5 / 600s | 8000 | yes |
| `confirm` — `/api/newsletter/confirm` | 10 / 600s | 2000 | no (token is the auth) |
| `moderate` — `/api/comments/moderate` | 20 / 600s | — | no (single-use token; cross-site form POST) |

A route reads its entry and passes it straight in:

```ts
import { security } from "@/config";
import { withGuard } from "@indiecrafts/security/guard";

const handle = withGuard(async (req, body) => { /* … */ }, security.newsletter);
```

## Edit here, not the route

To change a limit, edit `src/config/security.ts` — never the `route.ts`. Adding a **new** public
mutating route? Wrap it in `withGuard` with its own `security.<name>` entry, or the
[`verify:api-guards`](../setup/scripts) check fails CI (every public POST/PUT/PATCH/DELETE must adopt
`withGuard` or be allowlisted with a reason).

## Fail-open by default

Both layers `withGuard` adds here **fail open until configured** — deliberate, so the template runs
out of the box:

- **Rate limit** no-ops until `RATE_LIMIT_KV` is bound (`pnpm setup:kv`). The Cloudflare WAF `/api/*`
  rule is the **primary** limiter; this is defence-in-depth. See [Deployment](../setup/deployment) +
  [Cloudflare as code](../../../infra/cloudflare-iac).
- **Turnstile** no-ops until `TURNSTILE_SECRET` is set (with `NEXT_PUBLIC_TURNSTILE_SITE_KEY`); the
  per-engine honeypot stays the bot defense until then. Once the secret is set it fails **closed**.

Wire both before a production launch — until then the same-site origin check + honeypot + the external
WAF rule are the active defenses.
