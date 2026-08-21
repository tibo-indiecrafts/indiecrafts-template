# `security-counters` — KV (ephemeral, api-owned)

A Cloudflare **KV** namespace (binding `SECURITY_COUNTERS`) holding **short-TTL failed-login
counters** for the app-level detection layer. Keys are `fl:ip:<hashed-ip>` / `fl:user:<id>`;
each `bumpCounter` re-arms the sliding window (see
`@indiecrafts/packages-shared-security-events`). The api counts failed logins here — cheap and
ephemeral — and writes ONE `credential_stuffing` row to the EU D1 only when a count crosses the
threshold, keeping D1 low-volume.

- **Owner:** `api` (`code/shared/api/wrangler.toml`, per-env `[[env.<env>.kv_namespaces]]`).
- **No schema, no backup:** KV has no migrations; the data is disposable rate-state (TTL'd), so
  it is intentionally **not** backed up. Registered in
  [`scripts/lib/databases.mjs`](../../../../scripts/lib/databases.mjs) so the registry stays the
  full source of truth for which stores exist.
- **Create per env:** `wrangler kv namespace create indiecrafts-<env>-shared-api-security-counters`
  → paste the id into `wrangler.toml`.
