// Deploy a BARE Cloudflare Worker app (api · cron · workers) to one env. Shared by
// every worker slot — invoked from the app dir via its `deploy:<app>:<env>` script,
// so `wrangler.toml` + `wrangler deploy` resolve against that app. A bare worker:
// `wrangler deploy` bundles src/index.ts + its imports (no OpenNext build, unlike a
// Next app, which uses scripts/deploy-next.mjs). Prod asks to confirm; CI (CI=true)
// and `--yes` skip it.
//
//   node ../../../scripts/deploy-worker.mjs <app> <dev|staging|prod> [--yes]

import { readFileSync } from "node:fs";
import { assertRenamed } from "../lib/project.mjs";
import { run, confirmProd } from "../lib/deploy-shared.mjs";
import { ENVS } from "../lib/apps.mjs";
import { byKind } from "../lib/databases.mjs";

const [app, env] = process.argv.slice(2);
const yes = process.argv.includes("--yes");
if (!app || !ENVS.includes(env)) {
  console.error("Usage: deploy-worker.mjs <app> <dev|staging|prod> [--yes]");
  process.exit(1);
}

// Apply the D1 migrations this worker OWNS before shipping the new code (expand →
// migrate → contract). Passes the binding so wrangler resolves the right per-env DB.
// Skips a DB whose `database_id` is still the template placeholder — a fresh
// `deploy:shared:api:dev` must not fail just because D1 is not configured yet. A real
// migration error aborts the deploy (run() exits non-zero) — schema before code.
function migrateOwnedD1() {
  const toml = readFileSync("wrangler.toml", "utf8");
  for (const db of byKind("d1").filter((d) => d.owner === app && d.binding)) {
    const id = toml.match(
      new RegExp(
        `\\[\\[env\\.${env}\\.d1_databases\\]\\][\\s\\S]*?binding\\s*=\\s*"${db.binding}"[\\s\\S]*?database_id\\s*=\\s*"([^"]+)"`,
      ),
    )?.[1];
    if (!id || id === "PASTE_D1_ID_HERE") {
      console.log(
        `• D1 "${db.name}" (${db.binding}) not configured for ${env} — skipping migrations.`,
      );
      continue;
    }
    console.log(`• Migrating D1 "${db.name}" (${db.binding}) on ${env}…`);
    run("wrangler", [
      "d1",
      "migrations",
      "apply",
      db.binding,
      "--env",
      env,
      "--remote",
    ]);
  }
}

// Shared-account clobber guard: refuse a staging/prod deploy while the Worker name
// is still the template default (`indiecrafts-<app>`). `pnpm project:rename <slug>`
// rewrites it. dev is the shared sandbox, so it is allowed.
assertRenamed(app, env);
await confirmProd("Deploy", app, env, { yes });

migrateOwnedD1();
run("wrangler", ["deploy", "--env", env]);
console.log(`✓ Deployed ${app} to ${env}.`);
