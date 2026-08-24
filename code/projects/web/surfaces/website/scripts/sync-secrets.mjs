// Sync server secrets to a Cloudflare Worker env via `wrangler secret bulk`.
// Reads `.dev.vars` (fallback `.env.local`), keeps only non-public keys with real
// values, and bulk-uploads them — so you provision N secrets per env in one command
// instead of `wrangler secret put` × N. One Sanity dataset → the same secrets sync to
// every env. `NEXT_PUBLIC_*` are build-time vars (wrangler.toml [vars]), never secrets.
//
//   pnpm secrets:sync:web:website:dev | :staging | :prod

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertRenamed } from "../../../../../shared/scripts/lib/project.mjs";

const env = process.argv[2];
if (!["dev", "staging", "prod"].includes(env)) {
  console.error("Usage: sync-secrets.mjs <dev|staging|prod>");
  process.exit(1);
}

// Same clobber guard as deploy — secrets target the named Worker too.
assertRenamed("web", env);

const src = existsSync(".dev.vars") ? ".dev.vars" : ".env.local";
if (!existsSync(src)) {
  console.error(`✗ No ${src} — copy .dev.vars.example → .dev.vars and fill the tokens.`);
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
  console.error(`✗ No secrets found in ${src} (all empty or NEXT_PUBLIC_).`);
  process.exit(1);
}

// Temp JSON, 0600, always deleted.
const tmp = join(tmpdir(), `indiecrafts-secrets-${env}-${process.pid}.json`);
writeFileSync(tmp, JSON.stringify(secrets, null, 2), { mode: 0o600 });
console.log(`Syncing ${keys.length} secret(s) to the ${env} Worker: ${keys.join(", ")}`);
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
