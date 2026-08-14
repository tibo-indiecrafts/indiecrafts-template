#!/usr/bin/env node
// Terraform runner — PER APP × PER ENV. Isolates each env's state in its own
// Terraform workspace and passes `env/<env>.tfvars`.
//
//   node scripts/infra.mjs <app> <init|plan|apply|destroy|output> <dev|staging|prod>
//
// The `infra:<app>:<action>:<env>` package.json delegators call this. wrangler
// still deploys the Worker; this owns the Cloudflare edge (domain + security + cache).
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const [app, action, env] = process.argv.slice(2);
const ENVS = ["dev", "staging", "prod"];
const ACTIONS = ["init", "plan", "apply", "destroy", "output"];

if (!app || !ACTIONS.includes(action) || (action !== "init" && !ENVS.includes(env))) {
  console.error("usage: node scripts/infra.mjs <app> <init|plan|apply|destroy|output> <dev|staging|prod>");
  process.exit(1);
}

const dir = path.resolve("code/infra/iac/cloudflare/apps", app);
if (!existsSync(dir)) {
  console.error(`No IaC directory for app "${app}": ${dir}`);
  process.exit(1);
}
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error("CLOUDFLARE_API_TOKEN is required — a scoped token (Zone: DNS/Cache/WAF edit,\nAccount: Workers/Turnstile edit). See code/infra/iac/cloudflare/README.md.");
  process.exit(1);
}

const tf = (...args) => execFileSync("terraform", [`-chdir=${dir}`, ...args], { stdio: "inherit" });

tf("init", "-input=false");
if (action === "init") process.exit(0);

// Isolate this env's state in its own workspace (create on first run).
try {
  tf("workspace", "select", env);
} catch {
  tf("workspace", "new", env);
}

if (action === "output") tf("output");
else tf(action, "-input=false", `-var-file=env/${env}.tfvars`);
