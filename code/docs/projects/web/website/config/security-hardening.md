---
title: "Security hardening (Cloudflare-native)"
description: "The security posture is Cloudflare-native first — the edge does the heavy lifting as config (Terraform + dashboard), so there is no per-request DB/Worker load."
status: stable
---

# Security hardening (Cloudflare-native)

The security posture is **Cloudflare-native first** — the edge does the heavy lifting as
**config** (Terraform + dashboard), so there is no per-request DB/Worker load. We store
only the handful of **app-level** events Cloudflare can't see. Design record:
`docs/superpowers/specs/` (the security specs).

> **Two layers.** **Edge** = Cloudflare (WAF, bots, rate-limit, leaked-creds, Turnstile) —
> config, zero DB. **App** = the events post-auth logic produces (failed login, privilege
> escalation, data-exfil), stored low-volume in an EU D1.

## 1. What Cloudflare does natively — and where it's configured

Everything here is **zone-scoped**: it only applies once the site is on a **real
Cloudflare domain**. On `*.workers.dev` (the template default) the edge layer is inert.

| Protection                            | How                                                                   | Where                                                                                             | Free?                              |
| ------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------- |
| DDoS (L3/4 + L7)                      | always on, no config                                                  | —                                                                                                 | ✅                                 |
| Bad-bot challenge                     | **Bot Fight Mode**                                                    | Terraform `cloudflare_bot_management.fight_mode`                                                  | ✅                                 |
| AI-crawler block (GPTBot, ClaudeBot…) | **Block AI Bots**                                                     | dashboard: Security → Settings → Bot traffic                                                      | ✅                                 |
| SQLi / XSS / vuln                     | **Free Managed Ruleset**                                              | Terraform `cloudflare_ruleset.waf_managed`                                                        | ✅ (full OWASP = Pro)              |
| Geo / IP / UA blocking                | **WAF custom rule** (`ip.geoip.country`, IP lists, `http.user_agent`) | Terraform custom-phase ruleset                                                                    | ✅                                 |
| Credential stuffing                   | **Leaked-credentials detection** → managed-challenge                  | Terraform `cloudflare_ruleset.leaked_credentials` (enable detection in Security → Settings first) | ✅ (one field)                     |
| Rate limiting                         | **Rate-limiting rule** on `/api/*`                                    | Terraform `cloudflare_ruleset.rate_limit`                                                         | ✅ (**one** free rule; more = Pro) |
| Form bot protection                   | **Turnstile**                                                         | Terraform `cloudflare_turnstile_widget` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET`   | ✅                                 |
| TLS / HTTPS hardening                 | strict SSL · min TLS 1.2 · always-HTTPS                               | Terraform zone settings                                                                           | ✅                                 |
| **Edge security event log**           | **Security Events** + **Security Analytics** (GraphQL, dashboard)     | Cloudflare dashboard                                                                              | ✅ (24h / 7d retention)            |

Pro adds Super Bot Fight Mode + the full Managed + OWASP rulesets + >1 rate-limit rule;
Enterprise adds Bot Management (`cf.bot_management.score`), account-scoped config, and
Logpush export of firewall events.

**Do NOT hand-roll any of the above in a Worker** — it duplicates Cloudflare, adds a
proxy hop + KV reads per request, and fights the low-load goal. The Worker approach we
evaluated (AbuseIPDB / Project Honeypot / regex WAF on KV) is intentionally **not
ported** — Cloudflare's threat intel + managed rules cover it, free.

### Per-surface coverage (multi-root)

Each deployable is a separate root, so "protected" means different things per surface. Two
independent layers stack: the **edge** (zone-scoped Cloudflare, inert on `*.workers.dev`)
and the **app** (the Worker's inline guard / Clerk auth, which works everywhere).

| Surface                        | Edge (zone)                                                                                 | App-level                                             | Notes                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| **website** (next-cf)          | ✅ zone TF (`website/infra/cloudflare`)                                                     | `withGuard` on `/api/*`                               | full edge posture                                                      |
| **admin** (next-cf)            | its subdomain zone + a Cloudflare Access gate (reserved)                                    | fail-closed Clerk admin gate + data-layer authz       | not public                                                             |
| **api** (worker-cf)            | ✅ zone TF (`shared/api/infra/cloudflare`) — rate-limit `/v1/*` + WAF + bots + leaked-creds | **inline** bearer + native rate-limit guard (primary) | edge = defence in depth; the inline guard works on `*.workers.dev` too |
| **cron · workers** (worker-cf) | n/a (no HTTP surface)                                                                       | n/a                                                   | scheduled / queue only                                                 |
| **mobile** (native)            | n/a (app stores / device)                                                                   | Clerk auth + secure token store                       | failed-OTP → `kind:"security"`; edge N/A                               |

The **inline guard** (`code/shared/api/src/index.ts`: bearer + constant-time compare +
native rate-limit binding + body cap + CORS) is the primary gate for the bare Workers and
works on `*.workers.dev`. The zone stacks are the blunt backstop once a custom domain is on.

## 2. Provisioning (Terraform)

The edge is Terraform, co-located per root. The **website** stack
(`code/projects/web/surfaces/website/infra/cloudflare/main.tf`) toggles (all default on):
`enable_managed_waf`, `enable_bot_fight`, `enable_leaked_credentials`, `enable_cache_rules`,
`enable_tiered_cache`; tune `rate_limit_requests` / `rate_limit_period`. The **api** has its
own trimmed stack (`code/shared/api/infra/cloudflare/main.tf`) — custom domain + rate-limit
`/v1/*` + WAF + bots + leaked-creds + zone hardening (no Turnstile / cache rules). Both are
registry rows in `scripts/lib/infra-registry.mjs`.

```bash
pnpm infra:web:website:plan:prod    # review the website edge
pnpm infra:web:website:apply:prod   # provision (needs a scoped CLOUDFLARE_API_TOKEN)
pnpm infra:shared:api:plan:prod        # the api edge (once api.<root> is on a real zone)
pnpm infra:shared:api:apply:prod
```

Operator, once on a real domain: (1) enable **leaked-credentials detection** +
**Block AI Bots** in Security → Settings (dashboard-only), (2) apply the Terraform,
(3) point `turnstile_domains` at your host.

## 3. Where to see edge security events

**In Cloudflare's own dashboard** — Security → Events (blocked/challenged requests) and
Security Analytics (all traffic). It's free, better than anything we'd rebuild, and has
no storage cost. The admin's Security screen **deep-links** here rather than re-querying
it. (Rebuilding it via GraphQL needs a zone + API token + only retains 24h on Free —
not worth it.)

## 4. The app layer — what Cloudflare can't see

Post-auth application logic produces events the edge never sees. These are **low-volume**
(real incidents, not every request) and live in the api's **`audit` EU D1** (binding `AUDIT_DB`,
`--location weur`) — the `security_events` table, one of five append-only tables
(`admin_audit` · `session_events` · `security_events` · `csp_reports` · `backup_runs`) in
that database. `audit` is split from the api's second D1, **`main`** (binding `MAIN_DB`,
identity/rights/settings), so a firehose write-spike can't threaten identity data — see
[Data retention](/projects/web/website/config/data-retention). Written via **`POST /v1/events` `kind:"security"`**,
purged at 90 days by the cron worker.

Taxonomy (`security_events.event_type`): `failed_login` · `credential_stuffing` ·
`privilege_escalation` · `data_exfiltration` · `suspicious_pattern` ·
`rate_limit_exceeded`. Severity: `low | medium | high | critical`. Fields are
data-minimized — surface, user id (when known), country, a **hashed** IP, a short
description; never a raw IP or PII free-text. The taxonomy + the pure detection logic live
in the `@indiecrafts/packages-shared-security-events` brick.

**Feeds** (what writes them):

- **Failed logins** → the surfaces we drive by hand (mobile OTP verify) post a
  `kind:"security" failed_login`. The api **counts** these against a **KV TTL counter** and
  writes ONE `credential_stuffing` row only when the rate crosses the threshold — never a
  per-request D1 write. Web/admin use Clerk's own UI, so their failed logins are
  caught by the edge (leaked-creds + rate-limit), not an app hook.
- **Privilege escalation** → the **Clerk webhook** (`/v1/clerk-webhook`, Svix-verified)
  records any `user.updated` that grants `role: admin` — including a grant made OUTSIDE our
  admin UI (e.g. directly in the Clerk dashboard), which our own audit trail would miss.

**Efficiency rules** (baked in): count thresholds against a **KV counter with TTL**,
never a per-request DB query; write a row only when an incident crosses a threshold;
D1 is for review, not the firehose.

**Alerting.** A high or critical incident also emails the owner/DPO —
`SECURITY_ALERT_EMAIL`, falling back to `EMAIL_ADMIN_BCC` — sent non-blocking via
`ctx.waitUntil`. It never fails the write. See the
[breach-response runbook](/projects/web/website/config/breach-response) for what to do next.

## 5. Where it surfaces in admin

- **System status** (`/admin/system`) — surfaces · workers · **DB status** (the EU D1 health
  via the api `/health`).
- **Security** (`/admin/security`) — the app-incident feed (D1 `security_events` via
  `GET /v1/security`) + a deep-link to Cloudflare's edge Security Events.

## Issue tags

- `@debt SECURITY` — the edge layer is inert until the site is on a real Cloudflare zone;
  `*.workers.dev` gets DDoS + Bot Fight Mode only.
