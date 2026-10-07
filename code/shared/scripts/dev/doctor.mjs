// dev:doctor — preflight for the remote-dev loop. `pnpm dev` runs the workers as
// `wrangler dev --env <env> --remote`, so they execute on Cloudflare's EDGE against the
// REAL dev D1/KV/R2. That silently 500s when you're logged out, a worker has no
// `.dev.vars` (its --remote session then has no secrets), or the `[env.<env>]` ids are
// still placeholders. This checks those and FAILS LOUD with the fix instead. Wired as
// `predev` so `pnpm dev` runs it first. Warn-only by default (never blocks the loop);
// HARD-fails only when you're not logged in (the loop cannot work at all then). It also
// checks each web surface's `.env.local` for its registry `requiredEnv` (cross-surface).
// `--deep` adds a remote D1 migration-drift check (network). `SKIP_DEV_DOCTOR=1` bypasses.
//
//   node code/shared/scripts/dev/doctor.mjs [dev|staging|prod] [--deep]

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { APPS, ENVS } from "../lib/apps.mjs";
import { byKind } from "../lib/databases.mjs";
import { declaredKeys } from "../data/secrets.mjs";
import { wranglerEnvSection } from "../lib/project.mjs";
import { buildEnv, missingEnv } from "../lib/deploy-shared.mjs";

if (process.env.SKIP_DEV_DOCTOR) {
  console.log("dev:doctor skipped (SKIP_DEV_DOCTOR set).");
  process.exit(0);
}

const env = process.argv.find((a) => ENVS.includes(a)) ?? "dev";
const deep = process.argv.includes("--deep");
const workers = APPS.filter((a) => a.class === "worker-cf");

const warnings = [];
let hardFail = null;

// 1. Logged in? whoami via a worker package so `wrangler` resolves. A timeout or an
// ambiguous error only WARNS (never block the loop on a flaky check); a clear
// "not authenticated" HARD-fails, since --remote is guaranteed to fail without auth.
const who = spawnSync(
  "pnpm",
  ["--filter", workers[0].pkg, "exec", "wrangler", "whoami"],
  { encoding: "utf8", timeout: 20000 },
);
const whoText = `${who.stdout ?? ""}${who.stderr ?? ""}`;
if (/not authenticated|not logged in|you are not/i.test(whoText)) {
  hardFail =
    "Not logged in to Cloudflare — run  wrangler login  (wrangler dev --remote can't reach the edge without it).";
} else if (who.error || who.status !== 0) {
  warnings.push(
    "Could not verify Cloudflare login — check  wrangler whoami  manually.",
  );
}

// 2. Each worker's .dev.vars present + complete (the secrets its --remote session uses).
for (const w of workers) {
  const ex = resolve(w.dir, ".dev.vars.example");
  const dv = resolve(w.dir, ".dev.vars");
  const need = existsSync(ex)
    ? declaredKeys(readFileSync(ex, "utf8"))
    : new Set();
  if (need.size === 0) continue;
  if (!existsSync(dv)) {
    warnings.push(
      `${w.slug}: no .dev.vars — its --remote session has no secrets. Copy ${w.dir}/.dev.vars.example → .dev.vars and fill it (or run  pnpm dev:setup ).`,
    );
    continue;
  }
  const have = declaredKeys(readFileSync(dv, "utf8"));
  const missing = [...need].filter((k) => !have.has(k));
  if (missing.length)
    warnings.push(
      `${w.slug}: .dev.vars is missing keys: ${missing.join(", ")}.`,
    );
}

// 3. [env.<env>] resource ids are not template placeholders.
for (const w of workers) {
  const toml = resolve(w.dir, "wrangler.toml");
  if (
    existsSync(toml) &&
    /PASTE_[A-Z0-9_]*_HERE/.test(
      wranglerEnvSection(readFileSync(toml, "utf8"), env),
    )
  )
    warnings.push(
      `${w.slug}: wrangler.toml still has a PASTE_…_HERE placeholder — set the real ${env} D1/KV/R2 ids.`,
    );
}

// 4. Each web surface's `.env.local` sets its registry `requiredEnv` (the website pre-flights
// the rest with its own doctor:env). Warn-only: keyless local dev is a deliberate mode.
for (const a of APPS.filter((a) => a.requiredEnv?.length)) {
  const files = Object.fromEntries(
    [".env", ".env.local"]
      .map((f) => [f, resolve(a.dir, f)])
      .filter(([, p]) => existsSync(p))
      .map(([f, p]) => [f, readFileSync(p, "utf8")]),
  );
  const missing = missingEnv(a.requiredEnv, buildEnv(files, {}));
  if (missing.length)
    warnings.push(
      `${a.slug}: ${missing.join(", ")} not set in .env.local — fine for a keyless local run, but a deploy refuses it. See ${a.dir}/.env.example.`,
    );
}

// 5. --deep: remote D1 migration drift (network; advisory — only ever warns).
if (deep) {
  for (const db of byKind("d1")) {
    const owner = workers.find((w) => w.slug === db.owner);
    if (!owner || !db.binding) continue;
    const r = spawnSync(
      "pnpm",
      [
        "--filter",
        owner.pkg,
        "exec",
        "wrangler",
        "d1",
        "migrations",
        "list",
        db.binding,
        "--env",
        env,
        "--remote",
      ],
      { encoding: "utf8", timeout: 60000 },
    );
    const o = `${r.stdout ?? ""}${r.stderr ?? ""}`;
    if (/no migrations to apply|up to date/i.test(o)) continue;
    if (/migrations to be applied|to be applied|┌|│/i.test(o))
      warnings.push(
        `${db.name} (${db.binding}): unapplied migrations on ${env} — run  pnpm db:migrate:all:${env} .`,
      );
  }
}

// Report.
console.log(`dev:doctor — ${env}${deep ? " (deep)" : ""}`);
if (hardFail) {
  console.error(`✗ ${hardFail}`);
  for (const w of warnings) console.warn(`  · ${w}`);
  console.error(
    "  (bypass with  SKIP_DEV_DOCTOR=1 pnpm dev  if you know better.)",
  );
  process.exit(1);
}
if (warnings.length) {
  console.warn("⚠ dev is reachable, but:");
  for (const w of warnings) console.warn(`  · ${w}`);
  console.warn(
    "  (warnings don't block  pnpm dev  — fix them, or run  pnpm dev:setup .)",
  );
  process.exit(0);
}
console.log("✓ remote dev looks healthy.");
process.exit(0);
