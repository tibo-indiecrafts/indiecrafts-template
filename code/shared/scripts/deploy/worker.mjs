// Deploy a BARE Cloudflare Worker app (api · cron · workers) to one env. Shared by
// every worker slot — invoked from the app dir via its `deploy:<app>:<env>` script,
// so `wrangler.toml` + `wrangler deploy` resolve against that app. A bare worker:
// `wrangler deploy` bundles src/index.ts + its imports (no OpenNext build, unlike a
// Next app, which uses scripts/deploy-next.mjs). Prod asks to confirm; CI (CI=true)
// and `--yes` skip it.
//
//   node ../../../scripts/deploy-worker.mjs <app> <dev|staging|prod> [--yes]

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { assertRenamed } from "../lib/project.mjs";
import { run, gate, confirmProd } from "../lib/deploy-shared.mjs";
import { ENVS } from "../lib/apps.mjs";
import { byKind } from "../lib/databases.mjs";

const [app, env] = process.argv.slice(2);
const yes = process.argv.includes("--yes");
const yesProd = process.argv.includes("--yes-prod"); // intentional non-interactive PROD
const skipGate = process.argv.includes("--skip-gate"); // hotfix escape for the verify gate
const dryRun = process.argv.includes("--dry-run"); // build only; no migrate, no publish
// After deploy, sync secrets from `.dev.vars` (soft: a no-op if there are none) — like
// the website deploy and wahio's deploy-full. `--skip-secrets` opts out.
const skipSecrets = process.argv.includes("--skip-secrets");
if (!app || !ENVS.includes(env)) {
  console.error(
    "Usage: deploy-worker.mjs <app> <dev|staging|prod> [--yes] [--yes-prod] [--skip-gate] [--dry-run] [--skip-secrets]",
  );
  process.exit(1);
}

// Apply the D1 migrations this worker OWNS before shipping the new code (expand →
// migrate → contract). Delegates each owned DB to `migrate.mjs` — the single migration
// path — which takes a FAIL-CLOSED pre-migration R2 snapshot (schema + data) BEFORE
// applying, so a deploy-time migration never touches a remote DB without a fresh backup.
// A failed snapshot OR a migration error aborts the deploy (run() exits non-zero) —
// schema before code, and never a schema change we can't roll back. `--yes` so the
// delegate never re-prompts (the deploy already confirmed prod once, above). Skips a DB
// whose `database_id` is still the template placeholder — a fresh `deploy:shared:api:dev`
// must not fail just because D1 is not configured yet.
function migrateOwnedD1() {
  const migrate = fileURLToPath(
    new URL("../data/migrate.mjs", import.meta.url),
  );
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
    console.log(
      `• D1 "${db.name}" (${db.binding}) on ${env}: pre-migration backup → migrate…`,
    );
    run("node", [migrate, db.name, env, "--yes"]);
  }
}

// Shared-account clobber guard: refuse a staging/prod deploy while the Worker name
// is still the template default (`indiecrafts-<env>-shared-<app>`). `pnpm project:rename <slug>`
// rewrites it. dev is the shared sandbox, so it is allowed.
assertRenamed(app, env);
gate(env, { skipGate });
await confirmProd("Deploy", app, env, { yesProd });

// A dry run builds + bundles but never migrates D1 or publishes.
if (dryRun) {
  run("wrangler", ["deploy", "--env", env, "--dry-run"]);
  console.log(
    `✓ Dry run for ${app} on ${env} — bundled, no migration, nothing published.`,
  );
  process.exit(0);
}

migrateOwnedD1();
run("wrangler", ["deploy", "--env", env]);

// Secrets AFTER deploy — `wrangler secret bulk` needs the Worker to exist. `--soft` so a
// Worker with no `.dev.vars` (or none to sync) never fails the deploy. Runs from the app
// dir (CWD), so it reads THIS Worker's `.dev.vars`.
if (!skipSecrets) {
  const secrets = fileURLToPath(
    new URL("../data/secrets.mjs", import.meta.url),
  );
  run("node", [secrets, app, env, "--soft", ...(yes ? ["--yes"] : [])]);
}
console.log(`✓ Deployed ${app} to ${env}.`);
