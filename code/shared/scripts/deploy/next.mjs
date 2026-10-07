// Deploy a Next.js app (OpenNext → Cloudflare Workers: web · marketing · admin) to
// one env. Shared by every `next-cf` slot — invoked from the app dir via its
// `deploy:<app>:<env>` script, so `build:cf` + `wrangler.toml` resolve against that
// app. Runs the app's OWN `build:cf` (web's stamps a version; others just build),
// then `wrangler deploy`. Prod asks to confirm; CI (CI=true) and `--yes` skip it.
//
//   node ../../../scripts/deploy-next.mjs <app> <dev|staging|prod> [--yes]

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { assertRenamed } from "../lib/project.mjs";
import {
  run,
  gate,
  confirmProd,
  envVars,
  buildEnv,
  loopbackPublicVars,
  missingEnv,
} from "../lib/deploy-shared.mjs";
import { APPS, ENVS } from "../lib/apps.mjs";
import { originFor } from "../lib/domains.mjs";

const [app, env] = process.argv.slice(2);
const yes = process.argv.includes("--yes");
const yesProd = process.argv.includes("--yes-prod"); // intentional non-interactive PROD
const skipGate = process.argv.includes("--skip-gate"); // hotfix escape for the verify gate
const dryRun = process.argv.includes("--dry-run"); // build only, never publishes
// After deploy, sync secrets from `.dev.vars` (soft) — `--skip-secrets` opts out.
const skipSecrets = process.argv.includes("--skip-secrets");
if (!app || !ENVS.includes(env)) {
  console.error(
    "Usage: deploy-next.mjs <app> <dev|staging|prod> [--yes] [--yes-prod] [--skip-gate] [--dry-run] [--skip-secrets]",
  );
  process.exit(1);
}

// Refuse a staging/prod deploy while the Worker/R2 names are still the template
// default — a shared Cloudflare account would clobber another client.
assertRenamed(app, env);
// Quality gate (staging/prod, hand-run) then the prod confirm.
gate(env, { skipGate });
await confirmProd("Deploy", app, env, { yesProd });

// Runtime origin comes from the domain registry (single source of truth) — set it
// for the build unless the env already provides one. No-op until a real host is set.
const origin = originFor(app, env);
if (origin && !process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = origin;
  console.log(`↪ NEXT_PUBLIC_SITE_URL=${origin} (from the domain registry)`);
}

// The browser calls the api at NEXT_PUBLIC_API_URL, baked at build. Take it from this
// env's `API_URL` var (wrangler.toml `[env.<env>.vars]`, the server's own api origin),
// else the api's host in the domain registry — otherwise a deploy from a laptop bakes
// `.env.local`'s localhost into the bundle.
// Every other NEXT_PUBLIC_* in that block is baked the same way. An exported value wins.
const vars = envVars(readFileSync("wrangler.toml", "utf8"), env);
const apiUrl = vars.API_URL || originFor("api", env);
const baked = {
  ...Object.fromEntries(
    Object.entries(vars).filter(([k]) => k.startsWith("NEXT_PUBLIC_")),
  ),
  ...(apiUrl && { NEXT_PUBLIC_API_URL: apiUrl }),
};
for (const [k, v] of Object.entries(baked)) {
  if (process.env[k]) continue;
  process.env[k] = v;
  console.log(`↪ ${k}=${v} (${env})`);
}
// Fail closed: a public URL pointing at this machine breaks the site for every visitor.
const envFiles = Object.fromEntries(
  [".env", ".env.production", ".env.local", ".env.production.local"]
    .filter((f) => existsSync(f))
    .map((f) => [f, readFileSync(f, "utf8")]),
);
const built = buildEnv(envFiles, process.env);
const local = loopbackPublicVars(built);
if (local.length) {
  console.error(
    `✗ ${local.join(", ")} point at localhost — the ${env} build would ship them to every visitor.\n` +
      `  Set them for ${env}: an \`API_URL\` in wrangler.toml [env.${env}.vars], or export the value before deploying.`,
  );
  process.exit(1);
}
// Fail closed: the app's auth gate is opt-in on the Clerk key, so a keyless deploy is public.
const missing = missingEnv(
  APPS.find((a) => a.slug === app)?.requiredEnv,
  built,
);
if (missing.length) {
  console.error(
    `✗ ${missing.join(", ")} not set — refusing to deploy ${app} to ${env}.\n` +
      `  Set it in the app's .env.local, or (CI) as a GitHub Environment variable.`,
  );
  process.exit(1);
}

run("pnpm", ["run", "build:cf"]); // per-app build recipe (web: version stamp + OpenNext)
run("wrangler", ["deploy", "--env", env, ...(dryRun ? ["--dry-run"] : [])]);
if (dryRun) {
  console.log(`✓ Dry run for ${app} on ${env} — built, nothing published.`);
  process.exit(0);
}

// Secrets AFTER deploy (the Worker must exist for `wrangler secret bulk`). `--soft` so an
// app with no `.dev.vars` (admin/app today) never fails the deploy.
if (!skipSecrets) {
  const secrets = fileURLToPath(
    new URL("../data/secrets.mjs", import.meta.url),
  );
  run("node", [secrets, app, env, "--soft", ...(yes ? ["--yes"] : [])]);
}
console.log(`✓ Deployed ${app} to ${env}.`);
