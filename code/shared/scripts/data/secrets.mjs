// Sync a Worker's secrets to a Cloudflare env via `wrangler secret bulk`. Registry-driven:
// the KEYS are the app's `.dev.vars.example` + `.env.example` (a Next app declares there);
// the VALUES come from the gitignored `.dev.vars` (dev) or `.dev.vars.<staging|prod>` (a hand-run staging/prod deploy) OR `process.env` (CI — the deploy workflow injects them from the matching
// GitHub Environment's Secrets). So `pnpm deploy:<app>:<env>` auto-syncs secrets in BOTH
// places. Run from the app dir via its `secrets:sync:<app>:<env>` script, so `.dev.vars` +
// `wrangler` resolve against that Worker.
//
//   node ../../scripts/data/secrets.mjs <app> <dev|staging|prod> [--yes] [--soft]
//
// Secrets live in the gitignored `.dev.vars` (local) or the CI environment (per-env GitHub
// Environment Secrets); `.dev.vars.example` is the committed REGISTRY of which keys exist.
// `NEXT_PUBLIC_*` are public build vars (wrangler.toml [vars]), never secrets.

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ENVS, bySlug } from "../lib/apps.mjs";
import { assertRenamed } from "../lib/project.mjs";
import { confirmProd } from "../lib/deploy-shared.mjs";

const PLACEHOLDER = /^your_|_here$/i;

/** The secret KEY names declared in a `.dev.vars.example` (incl. commented `# KEY=`),
 *  minus `NEXT_PUBLIC_*` (public build vars). The registry of what MAY be sourced from the
 *  CI environment. Pure — unit-testable. */
export function declaredKeys(exampleText) {
  const keys = new Set();
  for (const line of (exampleText ?? "").split("\n")) {
    const m = line.match(/^#?\s*([A-Z0-9_]+)\s*=/);
    if (m && !m[1].startsWith("NEXT_PUBLIC_")) keys.add(m[1]);
  }
  return keys;
}

/** The real secret values to sync: each DECLARED key (the registry files) with a value in the
 *  local file or, failing that, in `env` (the CI path). The file wins over the env. Skips
 *  `NEXT_PUBLIC_*`, empty values, and `your_*` / `*_here` placeholders. An undeclared key —
 *  a dev tool key, a local-only URL — is never synced, from either source. Pure. */
export function collectSecrets(devVarsText, exampleText, env = {}) {
  const declared = declaredKeys(exampleText);
  const secrets = {};
  const take = (key, raw) => {
    if (key.startsWith("NEXT_PUBLIC_")) return;
    const val = String(raw ?? "")
      .replace(/^["']|["']$/g, "")
      .trim();
    if (!val || PLACEHOLDER.test(val)) return;
    secrets[key] = val;
  };
  // 1. Local file (.dev.vars / .env.local) — the dev source, declared keys only.
  for (const line of (devVarsText ?? "").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && declared.has(m[1])) take(m[1], m[2]);
  }
  // 2. process.env — declared secret keys not already sourced from the file (the CI path).
  for (const key of declared) {
    if (!(key in secrets)) take(key, env[key]);
  }
  return secrets;
}

/** The local secrets file for an env: dev reads `.dev.vars` (else `.env.local`); staging/prod
 *  read only `.dev.vars.<env>` (wrangler's per-env convention) — never the dev file, which would
 *  push dev keys and the dev GDPR salt to prod. No file → the env (CI) path alone. Pure. */
export function secretsFileFor(env, exists) {
  if (env !== "dev")
    return exists(`.dev.vars.${env}`) ? `.dev.vars.${env}` : null;
  if (exists(".dev.vars")) return ".dev.vars";
  return exists(".env.local") ? ".env.local" : null;
}

/** The committed key registries an app has: a Worker declares secrets in `.dev.vars.example`,
 *  a Next app in `.env.example` (some have both). Their union is what CI may sync. Pure. */
export function registryFiles(exists) {
  return [".dev.vars.example", ".env.example"].filter((f) => exists(f));
}

/** The keys `wrangler.toml` sets as plain vars under `[env.<env>.vars]`. Those are per-env
 *  config (API_URL, ADMIN_URL…), not secrets: a local value (e.g. `localhost`) must never be
 *  pushed over them, and a secret of the same name would clash with the var. Pure. */
export function wranglerVarKeys(tomlText, env) {
  const keys = new Set();
  let inVars = false;
  for (const line of (tomlText ?? "").split("\n")) {
    const header = line.match(/^\s*\[+([^\]]+)\]+/);
    if (header) {
      inVars = header[1].trim() === `env.${env}.vars`;
      continue;
    }
    const m = inVars && line.match(/^\s*([A-Z0-9_]+)\s*=/);
    if (m) keys.add(m[1]);
  }
  return keys;
}

async function main() {
  const [app, env] = process.argv.slice(2);
  const yes = process.argv.includes("--yes");
  // `--soft`: no-op (exit 0) when there is nothing to sync — used by the deploy runners so
  // a deploy never fails just because a Worker has no `.dev.vars` and no CI-injected secret.
  // A direct `secrets:sync:<app>:<env>` call omits it and errors loudly instead.
  const soft = process.argv.includes("--soft");
  if (!app || !bySlug(app) || !ENVS.includes(env)) {
    console.error(
      "Usage: secrets.mjs <app> <dev|staging|prod> [--yes] [--soft]",
    );
    process.exit(1);
  }

  // Same clobber guard + prod confirm as deploy — secrets target the named Worker too.
  assertRenamed(app, env);
  await confirmProd("Sync secrets to", app, env, { yes });

  const fileSrc = secretsFileFor(env, existsSync);
  const devVarsText = fileSrc ? readFileSync(fileSrc, "utf8") : "";
  const exampleText = registryFiles(existsSync)
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");
  const secrets = collectSecrets(devVarsText, exampleText, process.env);
  const vars = existsSync("wrangler.toml")
    ? wranglerVarKeys(readFileSync("wrangler.toml", "utf8"), env)
    : new Set();
  for (const key of vars) delete secrets[key];

  const keys = Object.keys(secrets);
  if (keys.length === 0) {
    const msg = `No secrets to sync for ${app} (no .dev.vars values, and no declared secret in the environment).`;
    if (soft) {
      console.log(`• ${msg} Skipping.`);
      process.exit(0);
    }
    console.error(`✗ ${msg}`);
    process.exit(1);
  }

  // Temp JSON, 0600, always deleted.
  const tmp = join(
    tmpdir(),
    `indiecrafts-secrets-${app}-${env}-${process.pid}.json`,
  );
  writeFileSync(tmp, JSON.stringify(secrets, null, 2), { mode: 0o600 });
  console.log(
    `Syncing ${keys.length} secret(s) to ${app} (${env}): ${keys.join(", ")}`,
  );
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
}

// Run the CLI only when invoked directly — so a test can import the pure helpers above.
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
