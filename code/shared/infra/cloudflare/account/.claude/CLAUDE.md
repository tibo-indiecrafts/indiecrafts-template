# account · infra — Cloudflare ACCOUNT-ALTITUDE stack (Terraform)

Auto-loads under `code/shared/infra/cloudflare/account/**`. The **account-altitude** Cloudflare stack —
account-wide config that is NOT tied to one zone or one app (zone creation, account settings, an
account-owned ruleset). At the `global` altitude in the infra registry, it is applied **first** (lowest
`order`). As shipped it manages **nothing** — it only declares the account id and offers the account-wide
resources as commented, opt-in blocks.

**Not the place for per-app edge.** WAF, rate-limit, cache rules, Turnstile, and Zero Trust Access gates are
ZONE-scoped and owned by each app's own co-located stack (`code/projects/**/infra/cloudflare`,
`code/shared/{api,agent}/infra/cloudflare`). This stack is only for things that span the whole account.

**Stack:** Terraform (`cloudflare/cloudflare ~> 5`). **Self-contained** — one `main.tf` holds the provider,
the single `account_id` variable, and the account-wide resources (all commented until needed).

## Files

- `main.tf` — provider + `variable "account_id"` + commented OPTIONAL blocks: (a) `cloudflare_zone` creation
  (zones usually pre-exist), (b) an account-level settings note, (c) an account-level ruleset example, and
  (d) a reminder that per-app edge lives in each app's stack. Also carries the commented remote-state backend.
- `env/{dev,staging,prod}.tfvars` — just `account_id` (the same value across envs, unless you run separate
  Cloudflare accounts per env).

## Run (from the repo root)

```bash
pnpm infra:shared:account:init            # once
pnpm infra:shared:account:plan:<env>      # review the diff
pnpm infra:shared:account:apply:<env>     # provision
```

Needs a `CLOUDFLARE_API_TOKEN` with **account-level** scopes for whatever you enable (e.g. Zone: Edit to
create a zone).

## Rules

- **Account-wide only** — if a resource is zone-scoped or app-specific, it belongs in that app's stack, not here.
- **NEVER commit state** — `terraform.tfstate*` holds the provisioned resource ids (gitignored here).
- **Zones usually pre-exist** — you normally add a domain to Cloudflare in the dashboard and reference its
  `zone_id` from each app's stack; only manage `cloudflare_zone` here for a domain you want Terraform to own.
- **Validate before first apply** — `terraform init && validate` against the pinned provider. It has never
  been applied (tfvars are placeholders).
- Registry: a row in `code/shared/scripts/lib/infra-registry.mjs` (altitude `global`). Full runbook →
  `code/docs/infra/cloudflare-iac.md`.
