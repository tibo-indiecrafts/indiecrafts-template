#!/usr/bin/env node
// Terraform for EVERY Cloudflare stack, one env, in registry apply order.
//
//   node code/shared/scripts/infra/all.mjs <plan|apply> <dev|staging|prod>
//   pnpm infra:all plan dev
//
// 1. Preflight all stacks first (`lib/tfvars-preflight.mjs`) and list every missing value
//    at once — nothing reaches Cloudflare until every stack's tfvars are ready.
// 2. Then run `infra/run.mjs <stack> <action> <env>` per stack (workspace per env). `apply`
//    stays interactive: Terraform prints each plan and waits for "yes" — never auto-approved.
// Needs CLOUDFLARE_API_TOKEN (scoped — see code/docs/shared/infra/cloudflare-iac.md).
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ordered } from "../lib/infra-registry.mjs";
import { preflight } from "../lib/tfvars-preflight.mjs";

const [action, env] = process.argv.slice(2);
if (
  !["plan", "apply"].includes(action) ||
  !["dev", "staging", "prod"].includes(env)
) {
  console.error("usage: pnpm infra:all <plan|apply> <dev|staging|prod>");
  process.exit(1);
}

const stacks = ordered();
let blocked = false;
for (const s of stacks) {
  const tfvars = path.join(s.dir, "env", `${env}.tfvars`);
  const problems = existsSync(tfvars)
    ? preflight(readFileSync(tfvars, "utf8"))
    : ["tfvars file missing"];
  if (problems.length) {
    blocked = true;
    console.error(`✗ ${s.name} — ${tfvars}`);
    for (const p of problems) console.error(`    - ${p}`);
  } else console.log(`✓ ${s.name} — ${tfvars}`);
}
if (!process.env.CLOUDFLARE_API_TOKEN) {
  blocked = true;
  console.error(
    "✗ CLOUDFLARE_API_TOKEN is not set — export a scoped token (Zone: DNS/Cache/WAF edit · Account: Workers/Turnstile/Access edit).",
  );
}
if (blocked) {
  console.error(
    `\nNothing was sent to Cloudflare. Fill the values above, then re-run: pnpm infra:all ${action} ${env}`,
  );
  process.exit(1);
}

const RUN = fileURLToPath(new URL("./run.mjs", import.meta.url));
for (const s of stacks) {
  console.log(`\n── ${s.name} · ${action} · ${env} ──`);
  execFileSync(process.execPath, [RUN, s.name, action, env], {
    stdio: "inherit",
  });
}
console.log(`\n✓ infra:all ${action} ${env} — ${stacks.length} stacks`);
