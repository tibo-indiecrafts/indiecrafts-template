# code/shared/infra — the IaC tier (Terraform)

Auto-loads under `code/shared/infra/**`. The **global** infrastructure-as-code tier: per-provider
Terraform stacks that stand up shared, project-wide edge infra. Layered under `code/shared/.claude/CLAUDE.md`.

- **`cloudflare/`** — the Cloudflare provider. `cloudflare/account/` is the live global stack
  (`main.tf` + `env/<env>.tfvars`, account-level DNS · WAF · cache · Turnstile · rate-limit); it
  has its own brief at `cloudflare/account/.claude/CLAUDE.md`. `cloudflare/README.md` is the
  reserved-slot template for adding more global stacks.
- **Per-app infra is NOT here** — each deployable co-locates its own stack under
  `code/projects/**/<app>/infra/<provider>/`. This tier is only the **shared/global** infra.

## Rules

- **Register, then run.** A new stack = a row in `code/shared/scripts/lib/infra-registry.mjs`
  (`{ name, provider, owner, altitude, dir, order }`), then `<name>/main.tf` + `env/<env>.tfvars`.
  Deploy/CI fan out from the registry — never hard-code a path.
- **Run from the repo root** — `pnpm infra:<name>:<action>:<env>` (or `node code/shared/scripts/infra.mjs <name> <init|plan|apply|destroy|output> <env>`).

Model → [`code/docs/shared/architecture/platform-deploy.md`](../../docs/shared/architecture/platform-deploy.md) · IaC → [`code/docs/shared/infra/cloudflare-iac.md`](../../docs/shared/infra/cloudflare-iac.md).
