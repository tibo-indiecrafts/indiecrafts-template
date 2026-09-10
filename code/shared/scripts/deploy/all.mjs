// Deploy every deployable app to one env, in registry order, fail-fast. Default:
// the CLOUDFLARE apps (the common "ship several apps to CF" case). `--only all`
// (or `--all`) also includes native apps (expo), which need their own
// credentials + runners. Each app self-deploys via its own `deploy:<slug>:<env>`
// script (read from the registry, `scripts/lib/apps.mjs`), so this runner never
// hardcodes per-app steps — a next-cf app runs OpenNext, a worker just `wrangler
// deploy`s, a native app runs its EAS recipe.
//
//   node scripts/deploy-all.mjs <dev|staging|prod> [--only cloudflare|all] [--all] [--yes] [--dry-run]

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { deployable, ENVS } from "../lib/apps.mjs";

const args = process.argv.slice(2);
const env = args[0];
const dry = args.includes("--dry-run");
const onlyIdx = args.indexOf("--only");
const only = args.includes("--all")
  ? "all"
  : onlyIdx >= 0
    ? args[onlyIdx + 1]
    : "cloudflare";
// Pass-through flags for each app's deploy (e.g. --yes), minus our own flags.
const passthru = args
  .slice(1)
  .filter(
    (a, i, arr) =>
      !["--dry-run", "--all", "--only", only].includes(a) &&
      arr[i - 1] !== "--only",
  );

if (!ENVS.includes(env)) {
  console.error(
    "Usage: deploy-all.mjs <dev|staging|prod> [--only cloudflare|all] [--yes] [--dry-run]",
  );
  process.exit(1);
}
if (!["cloudflare", "all"].includes(only)) {
  console.error(`✗ --only must be "cloudflare" or "all" (got "${only}").`);
  process.exit(1);
}

// Resolve each app's `deploy:<slug>:<env>` script up front, so a missing script is
// reported before anything deploys — no silent skip mid-run.
const plan = deployable({ only }).map((a) => {
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
  console.error(`No deployable apps for --only ${only}.`);
  process.exit(1);
}

console.log(`deploy:all → ${env}  (${only})${dry ? "  [dry run]" : ""}`);
for (const p of plan) {
  const mark = p.hasScript ? "▶" : "⚠";
  console.log(
    `  ${mark} ${p.slug}  (${p.class} · ${p.pkg} → ${p.hasScript ? p.script : "NO SCRIPT — will skip"})`,
  );
}
if (dry) process.exit(0);

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
  const r = spawnSync("pnpm", ["--filter", p.pkg, p.script, ...passthru], {
    stdio: "inherit",
  });
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
