# storybook · infra — co-located Cloudflare edge (Terraform)

Auto-loads under `code/projects/web/tools/storybook/infra/**`. The `storybook` static-assets Worker's
**per-tool Terraform root** — it owns the Cloudflare **edge** (custom domain · zone hardening · a
static-asset cache rule) that `wrangler.toml` can't express. The tool owns its whole deploy surface:
`wrangler.toml` ships the Worker (serving `storybook-static/` via Workers Static Assets), this ships the edge.

**MINIMAL by design.** The gallery is a read-only static site — no API, no forms — so this stack is far
smaller than the app stacks: no WAF, no rate-limit, no Bot Fight, no Turnstile.

**Stack:** Terraform (`cloudflare/cloudflare ~> 5`). **Self-contained** — one `main.tf` holds the provider,
the per-env variables, and the edge resources directly (no shared module).

## Files

- `main.tf` — provider + variables + edge resources (custom domain · immutable-asset cache rule · zone
  hardening [SSL strict · min TLS 1.2 · Always-HTTPS]) + the `domain` output. The zone-scoped resources are
  gated on `local.manage_zone` (`attach_domain && manage_zone`), so they stay **inert** until storybook owns a real zone. **Commented** optional:
  a remote-state backend.
- `env/{dev,staging,prod}.tfvars` — the per-env **values** (`account_id`, `zone_id`, `domain`,
  `worker_name`). `dev` runs on `*.workers.dev` (`attach_domain = false`); staging + prod attach a custom domain.

## Run (from the repo root)

```bash
pnpm infra:web:storybook:init            # once
pnpm infra:web:storybook:plan:<env>      # review the diff
pnpm infra:web:storybook:apply:<env>     # provision
```

## Rules

- **NEVER commit state** — `terraform.tfstate*` holds the provisioned resource ids (gitignored here).
- **`pnpm project:rename <slug>`** rewrites `worker_name` in these tfvars (matches the wrangler names) —
  don't hand-edit the stem.
- **Keep it minimal** — this is a static gallery. Do not copy the app stacks' WAF/rate-limit/Turnstile here;
  add a resource only if the gallery genuinely needs it.
- **`pnpm check:infra` is the gate** (in `pnpm verify` + CI): `fmt` · `validate` (warnings fail) · a
  mock-provider `plan` per env, creds-free. Commit `.terraform.lock.hcl` (pins the provider + darwin/linux
  hashes; refresh with `terraform providers lock -platform=darwin_arm64 -platform=darwin_amd64 -platform=linux_amd64`).
- **One owner per zone** — zone-wide resources (entrypoint rulesets · bot management · tiered cache · TLS
  settings) sit behind `local.manage_zone` (`attach_domain && manage_zone`). The prod website owns the
  shared zone; staging and the subdomain stacks set `manage_zone = false` in their tfvars.
- Registry: a row in `code/shared/scripts/lib/infra-registry.mjs`. Full runbook →
  `code/docs/shared/infra/cloudflare-iac.md`. Deploy model → `code/docs/shared/architecture/platform-deploy.md`.
