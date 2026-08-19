# Reserved — `aws` infra (leaf)

**Not built — a reserved slot.** a Terraform stack on AWS, at the **leaf** altitude, for the hybrid surface only. **(`aws` is reserved — only `cloudflare` is wired today.)**

**To activate:**

1. Add a row to `scripts/lib/infra-registry.mjs`:
   `{ name, provider: "aws", owner: "hybrid", altitude: "leaf", dir: "code/projects/hybrid/surfaces/main/infra/aws/<name>", order }`.
2. Add `<name>/main.tf` + `<name>/env/<env>.tfvars` here.
3. Run: `node scripts/infra.mjs <name> <init|plan|apply|destroy|output> <env>`.

Reserved, not empty — delete if never needed. Scoping → `code/projects/_registry.md`.
