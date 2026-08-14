// Deploy EVERY deployable app to one env, in order, fail-fast. A "deployable" is
// any `code/apps/*` dir with a `wrangler.toml`. Each app self-deploys via its own
// `deploy:<slug>:<env>` script, so this runner never hardcodes per-app steps
// (web builds with OpenNext; a bare worker just runs `wrangler deploy`).
//
//   node scripts/deploy-all.mjs <dev|staging|prod> [--yes] [--dry-run]
//
// --dry-run  list what WOULD deploy (order + script), run nothing. --yes passes
//            through to each app's deploy (skips prod confirms in CI).

import { readdirSync, existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const env = process.argv[2];
const dry = process.argv.includes("--dry-run");
const passthru = process.argv.slice(3).filter((a) => a !== "--dry-run"); // e.g. --yes

if (!["dev", "staging", "prod"].includes(env)) {
  console.error("Usage: deploy-all.mjs <dev|staging|prod> [--yes] [--dry-run]");
  process.exit(1);
}

// Deploy order: standalone services first, their consumer (the web app) last.
// Unlisted apps run after these, alphabetically.
const ORDER = ["api", "cron", "web"];
const rank = (name) => {
  const i = ORDER.indexOf(name);
  return i < 0 ? ORDER.length + 1 : i;
};

const APPS_DIR = "code/apps";
const deployable = readdirSync(APPS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(`${APPS_DIR}/${d.name}/wrangler.toml`))
  .map((d) => d.name)
  .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

if (deployable.length === 0) {
  console.error(`No deployable apps found (no ${APPS_DIR}/*/wrangler.toml).`);
  process.exit(1);
}

// Resolve each app's package name + its `deploy:<slug>:<env>` script up front, so a
// missing script is reported before anything deploys — no silent skip mid-run.
const plan = deployable.map((app) => {
  const pkg = JSON.parse(readFileSync(`${APPS_DIR}/${app}/package.json`, "utf8"));
  const script = `deploy:${app}:${env}`;
  return { app, name: pkg.name, script, hasScript: Boolean(pkg.scripts?.[script]) };
});

console.log(`deploy:all → ${env}${dry ? "  (dry run)" : ""}`);
for (const p of plan) {
  const mark = p.hasScript ? "▶" : "⚠";
  console.log(`  ${mark} ${p.app}  (${p.name} → ${p.hasScript ? p.script : "NO SCRIPT — will skip"})`);
}
if (dry) process.exit(0);

const results = [];
for (const p of plan) {
  if (!p.hasScript) {
    console.warn(`⚠ ${p.app}: no "${p.script}" — skipped (add one, or drop its wrangler.toml).`);
    results.push([p.app, "skipped"]);
    continue;
  }
  console.log(`\n▶ ${p.app} → ${env}`);
  const r = spawnSync("pnpm", ["--filter", p.name, p.script, ...passthru], { stdio: "inherit" });
  if (r.status !== 0) {
    results.push([p.app, "FAILED"]);
    console.error(`✗ ${p.app} failed — stopping (later apps not deployed).`);
    break;
  }
  results.push([p.app, "ok"]);
}

console.log("\n── deploy:all summary ──");
const glyph = { ok: "✓", skipped: "–", FAILED: "✗" };
for (const [app, status] of results) console.log(`  ${glyph[status]} ${app}: ${status}`);
process.exit(results.some(([, s]) => s === "FAILED") ? 1 : 0);
