#!/usr/bin/env node
// API guard adoption — proves every PUBLIC MUTATING route handler is hardened.
//
// Each POST/PUT/PATCH/DELETE route under a surface's `src/app/**` must either wrap
// its handler in `withGuard` (@indiecrafts/security/guard — origin + body-cap +
// rate-limit + Turnstile) OR be listed in ALLOWLIST below with the reason it uses a
// different auth (a capability token, a Bearer session). A new public POST that ships
// without either FAILS this check — so "all API safe" holds without a manual audit.
// GET handlers are exempt (withGuard is form-POST hardening by design).
//
//   node scripts/checks/api-guards.mjs      # exit 1 if a mutating route is unguarded
//
// API_GUARDS_ROOT overrides the scan root (a fixture tree) for tests.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = fileURLToPath(new URL("../../../projects", import.meta.url)); // code/projects
const ROOT = process.env.API_GUARDS_ROOT || DEFAULT_ROOT;
const IS_FIXTURE = !!process.env.API_GUARDS_ROOT;

// Deliberate non-`withGuard` mutating routes → the auth they use instead. Keyed by the
// path from `app/` onward, so it is independent of the absolute scan root.
const ALLOWLIST = {
  "api/comments/moderate/route.ts":
    "single-use moderationToken + cross-site form POST from the email client (rate-limited via rateLimit()).",
  "api/emails/test/route.ts":
    "Sanity Bearer-token auth (isProjectUser) + manual body cap; authenticated editor only.",
};

const MUTATING = ["POST", "PUT", "PATCH", "DELETE"];
const HANDLER_RE =
  /export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b|export\s+const\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*[:=]/g;

/** Recursively collect `route.ts(x)` files that sit under an `app/` segment. */
function findRoutes(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = `${dir}/${name}`;
    if (statSync(full).isDirectory()) findRoutes(full, acc);
    else if (/(^|\/)route\.tsx?$/.test(full) && full.replace(/\\/g, "/").includes("/app/"))
      acc.push(full);
  }
  return acc;
}

/** Path from `app/` onward, e.g. `api/comments/moderate/route.ts`. */
const routeKey = (file) => {
  const norm = file.replace(/\\/g, "/");
  return norm.slice(norm.indexOf("/app/") + "/app/".length);
};

const routes = findRoutes(ROOT);
const seenKeys = new Set();
const violations = [];

for (const file of routes) {
  const key = routeKey(file);
  seenKeys.add(key);
  const src = readFileSync(file, "utf8");
  const methods = new Set(
    [...src.matchAll(HANDLER_RE)].map((m) => m[1] ?? m[2]),
  );
  const mutates = MUTATING.some((m) => methods.has(m));
  if (!mutates) continue;
  if (/\bwithGuard\s*\(/.test(src)) continue;
  if (key in ALLOWLIST) continue;
  violations.push(key);
}

// Keep the allowlist honest — an entry whose file is gone is dead config. Only when
// scanning the real tree (a fixture run scans its own routes, not these).
const stale = IS_FIXTURE ? [] : Object.keys(ALLOWLIST).filter((k) => !seenKeys.has(k));

if (violations.length || stale.length) {
  for (const key of violations)
    console.error(
      `✗ api-guards: ${key} exports a mutating handler (POST/PUT/PATCH/DELETE) but does not use withGuard and is not allowlisted.`,
    );
  for (const key of stale)
    console.error(`✗ api-guards: allowlisted route "${key}" no longer exists — remove it from ALLOWLIST.`);
  console.error(
    "\nEvery public mutating route must wrap its handler in `withGuard`\n" +
      "(@indiecrafts/security/guard). If it authenticates another way, add it to\n" +
      "ALLOWLIST in this script with the reason.",
  );
  process.exit(1);
}

const mutatingCount = routes.filter((f) => {
  const src = readFileSync(f, "utf8");
  return MUTATING.some((m) =>
    [...src.matchAll(HANDLER_RE)].some((x) => (x[1] ?? x[2]) === m),
  );
}).length;
console.log(
  `✓ api-guards — ${routes.length} route handler${routes.length === 1 ? "" : "s"} scanned, ${mutatingCount} mutating (all guarded or allowlisted).`,
);
