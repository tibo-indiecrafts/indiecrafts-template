// Sync a bare Worker's secrets to a Cloudflare env via `wrangler secret bulk`. The
// shared, registry-driven twin of the website's `sync-secrets.mjs`: reads `.dev.vars`
// (fallback `.env.local`) from the app dir, keeps only real non-public values, and
// bulk-uploads them in one call. Run from the app dir via its `secrets:sync:<app>:<env>`
// script, so `.dev.vars` + `wrangler` resolve against that Worker.
//
//   node ../../scripts/data/secrets.mjs <app> <dev|staging|prod> [--yes]
//
// Secrets live ONLY in the gitignored `.dev.vars` (see each Worker's `.dev.vars.example`);
// `NEXT_PUBLIC_*` are public build vars (wrangler.toml [vars]), never secrets.

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ENVS, bySlug } from "../lib/apps.mjs";
import { assertRenamed } from "../lib/project.mjs";
import { confirmProd } from "../lib/deploy-shared.mjs";

const [app, env] = process.argv.slice(2);
const yes = process.argv.includes("--yes");
// `--soft`: no-op (exit 0) when there is nothing to sync — used by the deploy runners so
// a deploy never fails just because a Worker has no `.dev.vars` yet. A direct
// `secrets:sync:<app>:<env>` call omits it and errors loudly instead.
const soft = process.argv.includes("--soft");
if (!app || !bySlug(app) || !ENVS.includes(env)) {
  console.error("Usage: secrets.mjs <app> <dev|staging|prod> [--yes] [--soft]");
  process.exit(1);
}

// Same clobber guard + prod confirm as deploy — secrets target the named Worker too.
assertRenamed(app, env);
await confirmProd("Sync secrets to", app, env, { yes });

const src = existsSync(".dev.vars") ? ".dev.vars" : ".env.local";
if (!existsSync(src)) {
  const msg = `No .dev.vars in ${app} — copy .dev.vars.example → .dev.vars and fill the tokens.`;
  if (soft) {
    console.log(`• ${msg} Skipping secrets.`);
    process.exit(0);
  }
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const secrets = {};
for (const line of readFileSync(src, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (!m) continue; // comment / blank
  const [, key, raw] = m;
  if (key.startsWith("NEXT_PUBLIC_")) continue; // public → wrangler.toml [vars]
  const val = raw.replace(/^["']|["']$/g, "").trim();
  if (!val || /^your_|_here$/i.test(val)) continue; // skip placeholders
  secrets[key] = val;
}

const keys = Object.keys(secrets);
if (keys.length === 0) {
  const msg = `No secrets in ${src} (all commented, empty, or NEXT_PUBLIC_).`;
  if (soft) {
    console.log(`• ${msg} Skipping.`);
    process.exit(0);
  }
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// Temp JSON, 0600, always deleted.
const tmp = join(tmpdir(), `indiecrafts-secrets-${app}-${env}-${process.pid}.json`);
writeFileSync(tmp, JSON.stringify(secrets, null, 2), { mode: 0o600 });
console.log(`Syncing ${keys.length} secret(s) to ${app} (${env}): ${keys.join(", ")}`);
try {
  const r = spawnSync("wrangler", ["secret", "bulk", tmp, "--env", env], {
    stdio: "inherit",
  });
  if (r.status !== 0) {
    console.error(
      "✗ `wrangler secret bulk` failed (is the Worker deployed + you're logged in?).",
    );
    process.exit(r.status ?? 1);
  }
} finally {
  unlinkSync(tmp);
}
console.log("✓ Secrets synced.");
