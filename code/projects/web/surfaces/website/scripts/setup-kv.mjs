#!/usr/bin/env node
// One-time setup for the in-app rate limiter (@indiecrafts/packages-shared-security `withGuard`).
// Creates ONE `RATE_LIMIT_KV` namespace PER ENV (like the R2 ISR buckets) so a
// staging load-test can't burn a real prod user's rate-limit budget, then uncomments
// + fills each block's id in wrangler.toml (base + dev share the dev namespace;
// staging + prod get their own). Idempotent — re-running is a no-op once filled.
//
//   pnpm setup:web:website:kv
//
// Until this runs, the limiter fails OPEN (allows). Docs: setup/deployment.md.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOML = join(dirname(fileURLToPath(import.meta.url)), "..", "wrangler.toml");
const PLACEHOLDER = "PASTE_KV_ID_HERE";
const ENVS = ["dev", "staging", "prod"];

/** Create one namespace and return its 32-hex id (fails loudly if wrangler can't). */
function createNamespace(env) {
  const title = `RATE_LIMIT_KV_${env}`;
  console.log(`Creating KV namespace "${title}"…`);
  let out;
  try {
    out = execFileSync("npx", ["wrangler", "kv", "namespace", "create", title], {
      encoding: "utf8",
      stdio: ["inherit", "pipe", "inherit"],
    });
  } catch {
    console.error(
      `✗ Creating "${title}" failed. Authenticate (\`npx wrangler login\`), or create the three\n` +
        "  namespaces by hand and paste their ids into the RATE_LIMIT_KV blocks in wrangler.toml.",
    );
    process.exit(1);
  }
  const match = out.match(/\b([0-9a-f]{32})\b/i);
  if (!match) {
    console.error(`✗ Could not find a namespace id in the wrangler output:\n${out}`);
    process.exit(1);
  }
  return match[1];
}

function main() {
  const src = readFileSync(TOML, "utf8");
  if (!src.includes(PLACEHOLDER)) {
    console.log("✓ wrangler.toml already has RATE_LIMIT_KV bound — nothing to do.");
    return;
  }

  const ids = Object.fromEntries(ENVS.map((env) => [env, createNamespace(env)]));

  // Uncomment each 3-line RATE_LIMIT_KV block and fill the id matching its env
  // (the base `[[kv_namespaces]]` block shares the dev namespace, like `wrangler dev`).
  const lines = src.split("\n");
  const uncomment = (s) => s.replace(/^#\s?/, "");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '# binding = "RATE_LIMIT_KV"') {
      const header = lines[i - 1];
      const env = header.includes("env.staging")
        ? "staging"
        : header.includes("env.prod")
          ? "prod"
          : "dev";
      lines[i - 1] = uncomment(lines[i - 1]); // the [[…kv_namespaces]] header
      lines[i] = uncomment(lines[i]); // binding
      lines[i + 1] = uncomment(lines[i + 1]).replace(PLACEHOLDER, ids[env]); // id
    }
  }

  writeFileSync(TOML, lines.join("\n"));
  console.log(
    `✓ Bound RATE_LIMIT_KV per env (dev ${ids.dev}, staging ${ids.staging}, prod ${ids.prod}) — ` +
      "the in-app rate limiter is now live.",
  );
  console.log("  Re-deploy each env (`pnpm deploy:web:website:<env>`) to apply.");
}

main();
