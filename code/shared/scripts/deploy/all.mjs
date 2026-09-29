// Deploy every Cloudflare app to one env, in registry order, fail-fast. Each app
// self-deploys via its own `deploy:<slug>:<env>` script (read from the registry,
// `scripts/lib/apps.mjs`), so this runner never hardcodes per-app steps.
//
//   node scripts/deploy/all.mjs <dev|staging|prod> [--yes] [--dry-run]

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { deployable, ENVS } from "../lib/apps.mjs";
import { gate, confirmProd } from "../lib/deploy-shared.mjs";

const args = process.argv.slice(2);
const env = args[0];
const dry = args.includes("--dry-run");
const yesProd = args.includes("--yes-prod");
const skipGate = args.includes("--skip-gate");
// Pass-through flags for each app's deploy (e.g. --yes), minus our own flags.
const passthru = args.slice(1).filter((a) => a !== "--dry-run");

if (!ENVS.includes(env)) {
  console.error("Usage: deploy/all.mjs <dev|staging|prod> [--yes] [--dry-run]");
  process.exit(1);
}

// Resolve each app's `deploy:<slug>:<env>` script up front, so a missing script is
// reported before anything deploys — no silent skip mid-run.
const plan = deployable().map((a) => {
  const script = `deploy:${a.slug}:${env}`;
  let hasScript = false;
  try {
    hasScript = Boolean(
      JSON.parse(readFileSync(`${a.dir}/package.json`, "utf8")).scripts?.[
        script
      ],
    );
  } catch {
    /* missing package.json → hasScript stays false */
  }
  return { ...a, script, hasScript };
});

if (plan.length === 0) {
  console.error(`No deployable Cloudflare apps in the registry.`);
  process.exit(1);
}

console.log(`deploy:all → ${env}  (cloudflare)${dry ? "  [dry run]" : ""}`);
for (const p of plan) {
  const mark = p.hasScript ? "▶" : "⚠";
  console.log(
    `  ${mark} ${p.slug}  (${p.class} · ${p.pkg} → ${p.hasScript ? p.script : "NO SCRIPT — will skip"})`,
  );
}
if (dry) process.exit(0);

// Gate + confirm ONCE for the whole bulk deploy — then tell each per-app runner to skip
// its own gate/confirm (`--skip-gate --yes-prod`), so `pnpm verify` runs once, not per app,
// and prod is confirmed once, not N times. dev is a no-op; CI skips both.
gate(env, { skipGate });
await confirmProd("Deploy all", "every Cloudflare app", env, { yesProd });
const perApp = [
  "--skip-gate",
  ...(env === "prod" ? ["--yes-prod", "--yes"] : []),
];

const results = [];
for (const p of plan) {
  if (!p.hasScript) {
    console.warn(
      `⚠ ${p.slug}: no "${p.script}" — skipped (add one to its package.json).`,
    );
    results.push([p.slug, "skipped"]);
    continue;
  }
  console.log(`\n▶ ${p.slug} → ${env}`);
  const r = spawnSync(
    "pnpm",
    ["--filter", p.pkg, p.script, ...passthru, ...perApp],
    { stdio: "inherit" },
  );
  if (r.status !== 0) {
    results.push([p.slug, "FAILED"]);
    console.error(`✗ ${p.slug} failed — stopping (later apps not deployed).`);
    break;
  }
  results.push([p.slug, "ok"]);
}

console.log("\n── deploy:all summary ──");
const glyph = { ok: "✓", skipped: "–", FAILED: "✗" };
for (const [slug, status] of results)
  console.log(`  ${glyph[status]} ${slug}: ${status}`);
process.exit(results.some(([, s]) => s === "FAILED") ? 1 : 0);
