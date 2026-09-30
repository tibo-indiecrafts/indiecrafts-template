// Provision a Cloudflare binding (KV / D1 / queue) for a worker app + PRINT the
// ready-to-paste `wrangler.toml` block, per env. It does NOT auto-edit wrangler.toml
// — per-env TOML editing is bespoke and fragile, so paste the printed block under the
// app's `[env.<env>]`. Per-env resource names so a staging test can't touch prod data:
// KV follows the shared convention (`<prefix>-<env>-<tail>-<binding>`); D1/queue keep the
// short `<binding>-<env>` (their `database_name` in wrangler.toml is authoritative). Secrets
// are NOT bindings — use `wrangler secret put <NAME> --env <env>`.
//
//   node code/shared/scripts/infra/bindings.mjs <app> <dev|staging|prod> <kv|d1|queue> <BINDING_NAME>
//   e.g. node code/shared/scripts/infra/bindings.mjs workers prod kv JOBS_KV

import { spawnSync } from "node:child_process";
import { APPS, resourceName } from "../lib/apps.mjs";
import { readSitePrefix } from "../lib/project.mjs";

const [app, env, kind, binding] = process.argv.slice(2);
const KINDS = ["kv", "d1", "queue"];
if (
  !app ||
  !["dev", "staging", "prod"].includes(env) ||
  !KINDS.includes(kind) ||
  !binding
) {
  console.error(
    "Usage: node code/shared/scripts/infra/bindings.mjs <app> <dev|staging|prod> <kv|d1|queue> <BINDING_NAME>",
  );
  process.exit(1);
}

const appRow = APPS.find((a) => a.slug === app);
const pkg = appRow?.pkg ?? `@indiecrafts/${app}`;
const projectDir = appRow?.dir ?? `code/projects/${app}`;
const resource = `${binding.toLowerCase()}-${env}`;
// KV namespaces follow the shared resource-name convention (`<prefix>-<env>-<tail>-<binding>`),
// coherent with Workers / Pages / D1 — not a bespoke `<BINDING>_<env>`. Falls back to the old
// shape only when the app isn't a registry row (resourceName needs one).
const kvName = appRow
  ? `${resourceName(app, env, readSitePrefix())}-${binding.toLowerCase().replaceAll("_", "-")}`
  : `${binding}_${env}`;
const create = {
  kv: ["kv", "namespace", "create", kvName],
  // D1's region is fixed at creation — pin it to the EU (the GDPR design keeps every D1 there).
  d1: ["d1", "create", resource, "--location", "weur"],
  queue: ["queues", "create", resource],
}[kind];
const displayName = kind === "kv" ? kvName : resource;

console.log(`Creating ${kind} "${displayName}" for ${app} (${env})…`);
// Run wrangler from the app's dir (its .bin + wrangler.toml) via pnpm --filter.
const r = spawnSync("pnpm", ["--filter", pkg, "exec", "wrangler", ...create], {
  encoding: "utf8",
  stdio: ["inherit", "pipe", "inherit"],
});
if (r.status !== 0) {
  console.error(
    "✗ wrangler create failed. Authenticate (`wrangler login`) and retry.",
  );
  process.exit(1);
}
process.stdout.write(r.stdout);

const id =
  r.stdout.match(/\b([0-9a-f-]{32,36})\b/i)?.[1] ?? "<PASTE_ID_FROM_ABOVE>";
const block = {
  kv: `[[env.${env}.kv_namespaces]]\nbinding = "${binding}"\nid = "${id}"`,
  d1: `[[env.${env}.d1_databases]]\nbinding = "${binding}"\ndatabase_name = "${resource}"\ndatabase_id = "${id}"`,
  queue: `[[env.${env}.queues.consumers]]\nqueue = "${resource}"`,
}[kind];
console.log(`\n── paste into ${projectDir}/wrangler.toml ──\n${block}\n`);
console.log(
  `Then: \`pnpm --filter ${pkg} cf-typegen\` (regenerate the typed Env) + re-deploy.`,
);
