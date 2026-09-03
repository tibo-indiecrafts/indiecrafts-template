# agent · infra — co-located Cloudflare edge (Terraform)

Auto-loads under `code/shared/agent/infra/**`. The shared `agent` Worker's **per-service Terraform root** —
it owns the Cloudflare **edge** (custom domain · rate-limit `/v1/*` · WAF · Bot Fight · leaked-creds ·
zone hardening) that `wrangler.toml` can't express. A trimmed sibling of the website's stack: the agent is a
**bare Worker**, so this stack provisions no Turnstile widget of its own (the browser Turnstile the Worker
verifies is minted by the website's widget) and no Next static-cache rules.

**Stack:** Terraform (`cloudflare/cloudflare ~> 5`). **Self-contained** — one `main.tf` holds the provider,
the per-env variables, and the edge resources directly (no shared module).

## Files

- `main.tf` — provider + variables + edge resources (custom domain · rate-limit · WAF · Bot Fight ·
  leaked-credentials · zone hardening) + the `domain` output. The zone-scoped resources are gated on
  `attach_domain`, so they stay **inert** until the agent has a real zone.
- `env/{dev,staging,prod}.tfvars` — the per-env **values** (`account_id`, `zone_id`, `domain`,
  `worker_name`). dev/staging run on `*.workers.dev` (`attach_domain = false`); prod attaches `agent.<root>`.

## Run (from the repo root)

```bash
pnpm infra:shared:agent:init            # once
pnpm infra:shared:agent:plan:<env>      # review the diff
pnpm infra:shared:agent:apply:<env>     # provision
```

## Rules

- **Defence in depth, not the only gate** — the Worker's **inline** dual-mode guard (Turnstile/bearer +
  native rate-limit, `src/index.ts`) is the PRIMARY protection and works on `*.workers.dev` too; this edge
  stack is the blunt backstop that switches on once a zone is attached.
- **NEVER commit state** — `terraform.tfstate*` (gitignored here).
- **`pnpm project:rename <slug>`** rewrites `worker_name` in these tfvars (matches the wrangler names).
- **Validate before first apply** — `terraform init && validate` against the pinned provider. It has
  never been applied (tfvars are placeholders).
- Registry: a row in [`scripts/lib/infra-registry.mjs`](../../../scripts/lib/infra-registry.mjs). Full
  runbook → [`code/docs/infra/cloudflare-iac.md`](../../../../docs/infra/cloudflare-iac.md).
