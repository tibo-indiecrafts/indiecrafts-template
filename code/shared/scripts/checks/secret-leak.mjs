#!/usr/bin/env node
// Secret-leak guard — proves no server secret is exposed under a public build prefix.
//
// The repo NEVER: "never expose a non-public token under NEXT_PUBLIC_" (and the Expo
// EXPO_PUBLIC_ / Vite VITE_ equivalents — all inlined into a client bundle). This check
// encodes it without a hand-maintained list: the secret registry is the set of
// `*.dev.vars.example` / `.env.example` files, which document every secret the app uses.
//
//   node scripts/checks/secret-leak.mjs   # exit 1 if a documented secret sits under a public prefix
//
// Rule: for each key declared in an example file,
//   - a public-prefixed key (NEXT_PUBLIC_/EXPO_PUBLIC_/VITE_) is a DOCUMENTED PUBLIC var
//     (a legit bundle value — e.g. EXPO_PUBLIC_AGENT_TOKEN, the documented bundle abuse-gate);
//   - a non-public key that is not plain config (a URL, CSP mode) is a SECRET.
// Then scan app/brick/worker source: a `<PREFIX><SECRET>` occurrence fails UNLESS the exact
// var is a documented public key. A secret must be *documented* to be guarded — which is the
// convention anyway (every secret lives in a `.dev.vars.example`).
//
// SECRET_LEAK_ROOT overrides the base dir (a fixture tree) for tests.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CODE_DIR = fileURLToPath(new URL("../../..", import.meta.url)); // code/
const BASE = process.env.SECRET_LEAK_ROOT || CODE_DIR;
const IS_FIXTURE = !!process.env.SECRET_LEAK_ROOT;

const PUBLIC_PREFIXES = ["NEXT_PUBLIC_", "EXPO_PUBLIC_", "VITE_"];
// Non-public keys that are plain config, never credentials — excluded from the secret set.
const CONFIG = new Set([
  "CSP_MODE",
  "CSP_TRUSTED_TYPES",
  "SUPABASE_PROJECT_REF",
  "EMAIL_ADMIN_BCC",
  "EXAMPLE_TOKEN", // stub placeholder in the cron/workers examples
]);
const isConfig = (key) => key.endsWith("_URL") || CONFIG.has(key);

// Dirs never scanned: deps, build output, the toolchain itself (this script + its test would
// otherwise self-match), and the product docs (which may cite a leak as an example not-to-do).
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".turbo",
  ".wrangler",
  "dist",
  "build",
  "out",
  "coverage",
  ".git",
  "storybook-static",
]);
const skipPath = (p) => {
  const n = p.replace(/\\/g, "/");
  return n.includes("/shared/scripts/") || n.includes("/docs/");
};
const SCAN_EXT = /\.(tsx?|jsx?|mjs|cjs|json|toml)$/;

/** Walk `dir`, calling `onFile(fullPath)` for every non-skipped file. */
function walk(dir, onFile) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = `${dir}/${name}`;
    if (skipPath(full)) continue;
    if (statSync(full).isDirectory()) walk(full, onFile);
    else onFile(full);
  }
}

// --- Build the registry from example files -------------------------------------------------
const publicOk = new Set(); // documented public vars (full names)
const secrets = new Set(); // documented server secrets (bare names)
const KEY_RE = /^#?\s*([A-Z][A-Z0-9_]+)\s*=/;

walk(BASE, (file) => {
  if (!/(\.dev\.vars|\.env)\.example$/.test(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(KEY_RE);
    if (!m) continue;
    const key = m[1];
    if (PUBLIC_PREFIXES.some((p) => key.startsWith(p))) publicOk.add(key);
    else if (!isConfig(key)) secrets.add(key);
  }
});

// --- Scan source for a documented secret under a public prefix ------------------------------
const PREFIX_RE = new RegExp(
  `\\b(?:${PUBLIC_PREFIXES.join("|")})([A-Z0-9_]+)`,
  "g",
);
const violations = [];
let scanned = 0;

walk(BASE, (file) => {
  if (!SCAN_EXT.test(file) || /(\.dev\.vars|\.env)\.example$/.test(file))
    return;
  scanned++;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const m of line.matchAll(PREFIX_RE)) {
      const full = m[0];
      const suffix = m[1];
      if (publicOk.has(full)) continue; // documented public var
      if (secrets.has(suffix)) {
        const rel = file.replace(`${BASE}/`, "");
        violations.push({ rel, line: i + 1, full });
      }
    }
  });
});

if (violations.length) {
  for (const v of violations)
    console.error(
      `✗ secret-leak: ${v.rel}:${v.line} exposes the secret "${v.full}" under a public build prefix.`,
    );
  console.error(
    "\nA secret documented in a `.dev.vars.example` must never carry a NEXT_PUBLIC_ / EXPO_PUBLIC_ / VITE_\n" +
      "prefix — that inlines it into the client bundle. Read it server-side, or (if it is genuinely a\n" +
      "public bundle value) declare that public var in the surface's `.env.example` so it is allowlisted.",
  );
  process.exit(1);
}

if (secrets.size === 0 && !IS_FIXTURE) {
  console.error(
    "✗ secret-leak: no secrets found in any example file — the registry looks empty.",
  );
  process.exit(1);
}
console.log(
  `✓ secret-leak — ${scanned} file${scanned === 1 ? "" : "s"} scanned, ${secrets.size} documented secret${secrets.size === 1 ? "" : "s"} guarded, no public-prefixed leaks.`,
);
