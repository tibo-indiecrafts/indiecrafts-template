// Teardown — delete every Cloudflare resource an instance owns in one env, so the template
// ships clean (no leftover Workers / D1 / KV / R2 on the account). "Anonymised": every name
// is derived from the registries + the prefix (`lib/resources.mjs`), never a hard-coded id.
// DRY-RUN by default; `--yes` executes. Continue-on-error — a resource that is already gone
// is skipped, not fatal.
//
//   node scripts/infra/teardown.mjs <dev|staging|prod> [--yes] [--prefix <p>]
//
// ⚠ DESTRUCTIVE + IRREVERSIBLE. For cleaning a throwaway/demo instance or preparing the
// template for shipping — NEVER a live client env by accident (prod re-confirms by prefix).

import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { ENVS } from "../lib/apps.mjs";
import { readSitePrefix } from "../lib/project.mjs";
import { instanceResources } from "../lib/resources.mjs";

const args = process.argv.slice(2);
const env = args[0];
const execute = args.includes("--yes");
const pi = args.indexOf("--prefix");
const prefix = pi >= 0 ? args[pi + 1] : readSitePrefix();

if (!ENVS.includes(env)) {
  console.error(
    "Usage: teardown.mjs <dev|staging|prod> [--yes] [--prefix <p>]",
  );
  process.exit(1);
}

const res = instanceResources(env, prefix);
const flat = [
  ...res.workers.map((n) => ["worker", n]),
  ...res.d1.map((n) => ["d1", n]),
  ...res.kv.map((n) => ["kv", n]),
  ...res.r2.map((n) => ["r2", n]),
];

console.log(`Teardown "${prefix}" (${env}) — ${flat.length} resource(s):`);
for (const [kind, name] of flat) console.log(`  ${kind}\t${name}`);

if (!execute) {
  console.log(
    "\n[dry run] nothing deleted. Re-run with --yes to DELETE all of the above.",
  );
  process.exit(0);
}

// prod re-confirm (deleting a live client env would be catastrophic).
if (env === "prod" && !process.env.CI) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = await new Promise((r) =>
    rl.question(
      `⚠  Permanently DELETE ${flat.length} PROD resources for "${prefix}"? Type the prefix to confirm: `,
      r,
    ),
  );
  rl.close();
  if (ans.trim() !== prefix) {
    console.log("Aborted.");
    process.exit(0);
  }
}

// Run wrangler via the api workspace (its .bin), account-level.
const wrangler = (cmd) =>
  spawnSync(
    "pnpm",
    ["--filter", "@indiecrafts/shared-api", "exec", "wrangler", ...cmd],
    {
      encoding: "utf8",
    },
  );

// KV deletes by id, not name — resolve once.
function kvId(name) {
  const r = wrangler(["kv", "namespace", "list"]);
  try {
    return JSON.parse(r.stdout).find((n) => n.title === name)?.id;
  } catch {
    return undefined;
  }
}

const del = {
  worker: (n) => wrangler(["delete", "--name", n]),
  d1: (n) => wrangler(["d1", "delete", n, "--skip-confirmation"]),
  r2: (n) => wrangler(["r2", "bucket", "delete", n]),
  kv: (n) => {
    const id = kvId(n);
    return id
      ? wrangler(["kv", "namespace", "delete", "--namespace-id", id])
      : { status: 0, _skipped: true };
  },
};

let removed = 0;
for (const [kind, name] of flat) {
  process.stdout.write(`✖ ${kind} ${name} … `);
  const r = del[kind](name);
  if (r.status === 0 && !r._skipped) {
    removed++;
    console.log("deleted");
  } else {
    console.log(r._skipped ? "not found (skip)" : "absent / failed (skip)");
  }
}
console.log(
  `\nDone — ${removed}/${flat.length} removed (missing resources are skipped).`,
);
