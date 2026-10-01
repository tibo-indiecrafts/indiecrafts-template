#!/usr/bin/env node
// Manage GDPR_FINGERPRINT_SALT on the api worker. Mirrors the per-app
// wrangler-secret pattern (data/secrets.mjs). Cloudflare never returns secret
// values, so status/verify confirm PRESENCE only.
//
// Usage:
//   pnpm gdpr:salt:generate            → prints a fresh salt to stdout
//   pnpm gdpr:salt:set:<env>           → wrangler prompts; paste a value generated FOR that env
//                                         (do not paste the same value across envs)
//   pnpm gdpr:salt:status:<env>        → lists the worker's secrets
//
// Rule: a DISTINCT, independently-generated salt per environment; STABLE within an env
// (rotating it breaks every email-keyed erasure/consent lookup — never rotate a live one);
// never committed. Generate + set a separate value for dev, staging, and prod.
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { APPS } from "../lib/apps.mjs";
import { assertRenamed } from "../lib/project.mjs";

export const generateSalt = () => randomBytes(32).toString("hex");

const pkg =
  APPS.find((a) => a.slug === "api")?.pkg ?? "@indiecrafts/shared-api";

function wrangler(args) {
  return spawnSync("pnpm", ["--filter", pkg, "exec", "wrangler", ...args], {
    stdio: "inherit",
  });
}

// Executed only as a CLI, not when imported by the test.
if (import.meta.url === `file://${process.argv[1]}`) {
  const [action, env] = process.argv.slice(2);

  if (action === "generate") {
    process.stdout.write(`${generateSalt()}\n`);
    process.exit(0);
  }

  if (
    !["set", "status"].includes(action) ||
    !["dev", "staging", "prod"].includes(env)
  ) {
    console.error("Usage: gdpr-salt.mjs <generate | set <env> | status <env>>");
    process.exit(1);
  }

  assertRenamed("api", env); // clobber guard (dev is exempt)

  const r =
    action === "set"
      ? wrangler(["secret", "put", "GDPR_FINGERPRINT_SALT", "--env", env])
      : wrangler(["secret", "list", "--env", env]);
  process.exit(r.status ?? 0);
}
