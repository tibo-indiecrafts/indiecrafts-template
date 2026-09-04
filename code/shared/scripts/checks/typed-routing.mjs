#!/usr/bin/env node
// Typed-routing adoption — proves every Next surface routes through `@/i18n/routing`.
//
// Direct imports from `next/link` or `next-intl/navigation` bypass the project's
// locale-prefixed, typed-pathname, hreflang-consistent wrappers. The `website`
// surface bans them via ESLint (`no-restricted-imports`), but the `admin` / `app`
// scaffolds ship tsc-only (no ESLint), so this registry-driven scan is the gate
// that holds the NEVER across ALL next-cf surfaces without a per-surface lint setup.
// The ONE file allowed to import `next-intl/navigation` is `src/i18n/routing.ts`
// itself — the single point where the typed wrappers are created.
//
//   node scripts/checks/typed-routing.mjs   # exit 1 if a surface imports the banned modules
//
// TYPED_ROUTING_ROOT overrides the scan root (a fixture tree) for tests.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { byClass } from "../lib/apps.mjs";

const REPO_ROOT = fileURLToPath(new URL("../../../..", import.meta.url)); // repo root

// The next-cf surfaces (website · admin · app) — from the registry, so a new one auto-joins.
const SURFACE_DIRS = byClass("next-cf").map((a) => `${REPO_ROOT}/${a.dir}/src`);

// A fixture run points at one throwaway tree instead of the real surfaces.
const ROOTS = process.env.TYPED_ROUTING_ROOT
  ? [process.env.TYPED_ROUTING_ROOT]
  : SURFACE_DIRS;

const BANNED = ["next/link", "next-intl/navigation"];
// Match an import/re-export/require of a banned module: `from "next/link"`,
// `import "next/link"`, `require("next/link")`. Escapes the `/` in the specifier.
const banned = BANNED.map((m) => m.replace(/\//g, "\\/")).join("|");
const IMPORT_RE = new RegExp(
  `(?:from|import)\\s*\\(?\\s*['"](${banned})['"]`,
  "g",
);
const REQUIRE_RE = new RegExp(`require\\(\\s*['"](${banned})['"]\\s*\\)`, "g");

const SRC_EXT = /\.(?:m|c)?[jt]sx?$/;
// The routing module is allowed (and required) to import next-intl/navigation.
const isRoutingModule = (file) =>
  file.replace(/\\/g, "/").endsWith("/i18n/routing.ts");

/** Recursively collect scannable source files under a dir. */
function findSources(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc; // a surface with no src/ (or a missing fixture path) → nothing to scan
  }
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = `${dir}/${name}`;
    if (statSync(full).isDirectory()) findSources(full, acc);
    else if (SRC_EXT.test(name)) acc.push(full);
  }
  return acc;
}

const files = ROOTS.flatMap((r) => findSources(r));
const violations = [];

for (const file of files) {
  if (isRoutingModule(file)) continue;
  const src = readFileSync(file, "utf8");
  const hits = new Set(
    [...src.matchAll(IMPORT_RE), ...src.matchAll(REQUIRE_RE)].map((m) => m[1]),
  );
  for (const mod of hits) {
    violations.push({ file: file.replace(`${REPO_ROOT}/`, ""), mod });
  }
}

if (violations.length) {
  for (const { file, mod } of violations)
    console.error(
      `✗ typed-routing: ${file} imports "${mod}" — use \`@/i18n/routing\` instead.`,
    );
  console.error(
    "\nEvery Next surface must route through `@/i18n/routing` (Link / redirect /\n" +
      "usePathname / useRouter / getPathname) so locale prefixes, typed pathnames, and\n" +
      "hreflang stay consistent. Only `src/i18n/routing.ts` may import next-intl/navigation.",
  );
  process.exit(1);
}

console.log(
  `✓ typed-routing — ${files.length} source file${files.length === 1 ? "" : "s"} scanned across ${ROOTS.length} surface${ROOTS.length === 1 ? "" : "s"}, none bypass @/i18n/routing.`,
);
