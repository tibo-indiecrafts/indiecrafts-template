// Provision a Cloudflare binding (KV / D1 / queue) for a worker app + PRINT the
// ready-to-paste `wrangler.toml` block, per env. It does NOT auto-edit wrangler.toml
// — per-env TOML editing is bespoke and fragile, so paste the printed block under the
// app's `[env.<env>]`. Per-env resource names (`<binding>-<env>`) so a staging test
// can't touch prod data (mirrors the web app's `RATE_LIMIT_KV_<env>`). Secrets are
// NOT bindings — use `wrangler secret put <NAME> --env <env>`.
//
//   node scripts/setup-bindings.mjs <app> <dev|staging|prod> <kv|d1|queue> <BINDING_NAME>
//   e.g. node scripts/setup-bindings.mjs workers prod kv JOBS_KV

import { spawnSync } from "node:child_process";

const [app, env, kind, binding] = process.argv.slice(2);
const KINDS = ["kv", "d1", "queue"];
if (!app || !["dev", "staging", "prod"].includes(env) || !KINDS.includes(kind) || !binding) {
  console.error(
    "Usage: setup-bindings.mjs <app> <dev|staging|prod> <kv|d1|queue> <BINDING_NAME>",
  );
  process.exit(1);
}

const pkg = `@indiecrafts/${app}`;
const resource = `${binding.toLowerCase()}-${env}`;
const create = {
  kv: ["kv", "namespace", "create", `${binding}_${env}`],
  d1: ["d1", "create", resource],
  queue: ["queues", "create", resource],
}[kind];

console.log(`Creating ${kind} "${resource}" for ${app} (${env})…`);
// Run wrangler from the app's dir (its .bin + wrangler.toml) via pnpm --filter.
const r = spawnSync("pnpm", ["--filter", pkg, "exec", "wrangler", ...create], {
  encoding: "utf8",
  stdio: ["inherit", "pipe", "inherit"],
});
if (r.status !== 0) {
  console.error("✗ wrangler create failed. Authenticate (`wrangler login`) and retry.");
  process.exit(1);
}
process.stdout.write(r.stdout);

const id = r.stdout.match(/\b([0-9a-f-]{32,36})\b/i)?.[1] ?? "<PASTE_ID_FROM_ABOVE>";
const block = {
  kv: `[[env.${env}.kv_namespaces]]\nbinding = "${binding}"\nid = "${id}"`,
  d1: `[[env.${env}.d1_databases]]\nbinding = "${binding}"\ndatabase_name = "${resource}"\ndatabase_id = "${id}"`,
  queue: `[[env.${env}.queues.consumers]]\nqueue = "${resource}"`,
}[kind];
console.log(`\n── paste into code/projects/${app}/wrangler.toml ──\n${block}\n`);
console.log(`Then: \`pnpm --filter ${pkg} cf-typegen\` (regenerate the typed Env) + re-deploy.`);
