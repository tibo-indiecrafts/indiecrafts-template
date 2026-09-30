# `@indiecrafts/packages-shared-security-events` — app-level security taxonomy + detection (DOM-free)

**Stack:** TypeScript. Pure, framework-agnostic (no Clerk/React/Next/DOM/Worker import — the
`shared/` scope rule). The contract every surface uses to report a security incident, plus the
pure detection logic the `api` shell imports (services are shells — job logic lives here, never in
`api/src`). No dependencies. Auto-loads under `code/packages/shared/security-events/**`. Subpath `exports`.

- **`SecurityEventType` · `Severity` · `SecurityEvent`** (`./events`) — the taxonomy. The single home
  for the incident shape every surface posts to the api `/v1/events` (`kind:"security"`). Data-minimized:
  no raw IP, no PII free-text — the api derives country + a salted IP hash server-side.
- **`classifyFailedLogins(count)` · `FAILED_LOGIN`** (`./thresholds`) — pure sliding-window policy: does
  the running failed-login count for one key cross into a stored `credential_stuffing` incident, and at
  what severity. No I/O.
- **`bumpCounter(kv, key, ttl)` · `KvLike`** (`./kv-counter`) — a TTL counter over a structural KV
  surface. Failed-login rates are counted in KV (cheap, ephemeral); only a threshold crossing writes one
  D1 row. `ponytail:` read-then-write, not atomic — fine for low-volume counting.

**What does NOT belong here:** the edge firehose (blocked/challenged requests) — that stays in
Cloudflare's own Security Events dashboard, deep-linked from the admin, never mirrored to D1. This brick
is only the low-volume post-auth incidents Cloudflare cannot see.

Full design → [`code/docs/projects/web/website/config/security-hardening.md`](../../../../docs/projects/web/website/config/security-hardening.md).
