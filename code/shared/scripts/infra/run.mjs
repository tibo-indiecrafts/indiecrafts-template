#!/usr/bin/env node
// Terraform runner — registry-driven, PER STACK × PER ENV. Reads the infra
// registry (`scripts/lib/infra-registry.mjs`), dispatches on the stack's
// `provider`, isolates each env's state in its own Terraform workspace, and
// passes `env/<env>.tfvars`.
//
//   node code/shared/scripts/infra/run.mjs <name> <init|plan|apply|destroy|output> <dev|staging|prod>
//
// <name> matches an INFRA row (e.g. "website"). Falls back to an app's co-located
// `<app.dir>/infra/cloudflare` for an app not yet listed in the infra registry.
// The `infra:<name>:<action>:<env>` package.json delegators call this. wrangler
// still deploys the Worker; this owns the edge (domain + security + cache).
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { APPS } from "../lib/apps.mjs";
import { INFRA } from "../lib/infra-registry.mjs";

const [name, action, env] = process.argv.slice(2);
const ENVS = ["dev", "staging", "prod"];
const ACTIONS = ["init", "plan", "apply", "destroy", "output"];

if (
  !name ||
  !ACTIONS.includes(action) ||
  (action !== "init" && !ENVS.includes(env))
) {
  console.error(
    "usage: node code/shared/scripts/infra/run.mjs <name> <init|plan|apply|destroy|output> <dev|staging|prod>",
  );
  process.exit(1);
}

// Resolve the stack from the registry (name → provider + dir); fall back to an
// app's co-located cloudflare stack. IaC is CO-LOCATED + self-contained:
// <dir>/main.tf + env/<env>.tfvars. Copy that dir to add IaC elsewhere.
const row = INFRA.find((i) => i.name === name);
const provider = row?.provider ?? "cloudflare";
const appDir =
  APPS.find((a) => a.slug === name)?.dir ?? path.join("code/projects", name);
const dir = path.resolve(row?.dir ?? path.join(appDir, "infra", "cloudflare"));

// Cloudflare is the only wired provider; guard any other value from a stray registry row.
if (provider !== "cloudflare") {
  console.error(
    `infra provider "${provider}" is not supported — only "cloudflare" is wired (stack "${name}").`,
  );
  process.exit(1);
}
if (!existsSync(dir)) {
  console.error(`No IaC directory for "${name}": ${dir}.`);
  process.exit(1);
}
if (!process.env.CLOUDFLARE_API_TOKEN) {
  console.error(
    "CLOUDFLARE_API_TOKEN is required — a scoped token (Zone: DNS/Cache/WAF edit,\nAccount: Workers/Turnstile edit). See code/docs/shared/infra/cloudflare-iac.md.",
  );
  process.exit(1);
}

const tf = (...args) =>
  execFileSync("terraform", [`-chdir=${dir}`, ...args], { stdio: "inherit" });

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
