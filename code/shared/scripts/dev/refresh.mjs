// dev:refresh — re-align the remote dev bindings WITHOUT a full redeploy: apply any
// pending D1 migrations (all owned DBs) + push the latest secrets from each worker's
// `.dev.vars`. Use it after editing a migration or a secret while working on dev, instead
// of a whole `deploy:all`. `--secrets-only` skips the migrations (the `secrets:sync:all` case).
//
//   node code/shared/scripts/dev/refresh.mjs <dev|staging|prod> [--secrets-only]

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { APPS, ENVS } from "../lib/apps.mjs";
import { run } from "../lib/deploy-shared.mjs";

const env = process.argv[2];
const secretsOnly = process.argv.includes("--secrets-only");
if (!ENVS.includes(env)) {
  console.error("Usage: refresh.mjs <dev|staging|prod> [--secrets-only]");
  process.exit(1);
}

const migrate = fileURLToPath(new URL("../data/migrate.mjs", import.meta.url));
const secrets = fileURLToPath(new URL("../data/secrets.mjs", import.meta.url));

// 1. Migrations (all owned D1s; each takes its own fail-closed pre-migration backup).
if (!secretsOnly) run("node", [migrate, "--all", env]);

// 2. Secrets — run secrets.mjs FROM each worker's dir (it reads that Worker's .dev.vars +
// wrangler.toml from CWD). `--soft` so a worker with nothing to sync never fails.
for (const w of APPS.filter((a) => a.class === "worker-cf")) {
  console.log(`\n▶ secrets → ${w.slug} (${env})`);
  const r = spawnSync("node", [secrets, w.slug, env, "--soft"], {
    stdio: "inherit",
    cwd: resolve(process.cwd(), w.dir),
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log(
  `\n✓ dev:refresh (${env})${secretsOnly ? " — secrets only" : ""} done.`,
);
