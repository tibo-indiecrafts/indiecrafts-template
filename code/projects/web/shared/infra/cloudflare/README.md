# Reserved — `cloudflare` infra (platform)

**Not built — a reserved slot.** a Terraform stack on the Cloudflare provider (DNS · WAF · cache · Turnstile), at the **platform** altitude, for every surface of the web platform.

**To activate:**

1. Add a row to `scripts/lib/infra-registry.mjs`:
   `{ name, provider: "cloudflare", owner: "web", altitude: "platform", dir: "code/projects/web/shared/infra/cloudflare/<name>", order }`.
2. Add `<name>/main.tf` + `<name>/env/<env>.tfvars` here.
3. Run: `node scripts/infra.mjs <name> <init|plan|apply|destroy|output> <env>`.

Reserved, not empty — delete if never needed. Scoping → `code/projects/_registry.md`.
