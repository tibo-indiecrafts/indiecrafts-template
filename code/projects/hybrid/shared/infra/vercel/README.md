# Reserved — `vercel` infra (platform)

**Not built — a reserved slot.** a Terraform stack on Vercel, at the **platform** altitude, for every surface of the hybrid platform. **(`vercel` is reserved — only `cloudflare` is wired today.)**

**To activate:**

1. Add a row to `scripts/lib/infra-registry.mjs`:
   `{ name, provider: "vercel", owner: "hybrid", altitude: "platform", dir: "code/projects/hybrid/shared/infra/vercel/<name>", order }`.
2. Add `<name>/main.tf` + `<name>/env/<env>.tfvars` here.
3. Run: `node scripts/infra.mjs <name> <init|plan|apply|destroy|output> <env>`.

Reserved, not empty — delete if never needed. Scoping → `code/projects/_registry.md`.
