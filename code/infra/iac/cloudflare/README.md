# Cloudflare as code

Terraform for the Cloudflare **edge** — auto custom domain · WAF · rate-limit (`/api/*`) · Bot Fight
Mode · cache rules · Tiered Cache · zone hardening · the Turnstile widget. **Per app × per env**.
`wrangler` deploys the Worker; this owns the edge (the parts `wrangler.toml` can't express).

- **Module:** `modules/site/main.tf` (the reusable resources).
- **App:** `apps/web/` — invokes the module; per-env values in `env/{dev,staging,prod}.tfvars`;
  state isolated per env in a Terraform workspace.
- **Run:** `pnpm infra:web:{init,plan,apply,output}:<env>` (needs a scoped `CLOUDFLARE_API_TOKEN`).
- **Add app #2:** copy `apps/web/` → `apps/<app>/`, retarget the tfvars, add `infra:<app>:*` delegators.

**Full runbook** (token scopes, Turnstile-key handoff, caching, remote state) →
[`docs/infra/cloudflare-iac.md`](../../../../docs/infra/cloudflare-iac.md).
