/**
 * Generate `src/shared/brands.ts` from `brands.json` and the `simple-icons` package.
 *
 * @see docs/reference/packages/shared/ui-icons/scripts/build-brands.md
 */
// Generate `src/shared/brands.ts` from `src/shared/brands.json` (our name →
// simple-icons export) + the `simple-icons` package (official marks). Runtime
// stays dependency-free — the generated file is plain data. Edit brands.json
// and run `pnpm brands:build`; `--check` verifies brands.ts is in sync (CI).
// Mirrors tokens:build / tokens:check.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import prettier from "prettier";
import * as simpleIcons from "simple-icons";

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG = join(HERE, "..", "src", "shared", "brands.json");
const OUT = join(HERE, "..", "src", "shared", "brands.ts");
const CHECK = process.argv.slice(2).includes("--check");

const config = JSON.parse(readFileSync(CONFIG, "utf8"));
const names = Object.keys(config);

// Index simple-icons by their stable `slug` (the export-name casing is fiddly).
const bySlug = {};
for (const icon of Object.values(simpleIcons)) {
  if (icon && icon.slug && icon.path) bySlug[icon.slug] = icon;
}

const marks = names.map((name) => {
  const src = config[name];
  // Inline override — for a mark simple-icons doesn't carry (e.g. LinkedIn,
  // removed there for legal reasons). `{ title, hex, path }` used as-is.
  if (src && typeof src === "object") {
    return { name, title: src.title, hex: src.hex, path: src.path };
  }
  // Otherwise a simple-icons slug — pull the official mark.
  const icon = bySlug[src];
  if (!icon) {
    console.error(
      `✗ brands.json: "${name}" → unknown simple-icons slug "${src}".`,
    );
    process.exit(1);
  }
  return { name, title: icon.title, hex: `#${icon.hex}`, path: icon.path };
});

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const union = names.map((n) => `  | "${n}"`).join("\n");
const entries = marks
  .map(
    (m) =>
      `  ${m.name}: { title: "${esc(m.title)}", hex: "${m.hex}", path: "${esc(m.path)}" },`,
  )
  .join("\n");

const raw = `/**
 * Brand / social marks — GENERATED from \`brands.json\` + the \`simple-icons\`
 * package. Do NOT edit by hand: change \`brands.json\` and run \`pnpm brands:build\`
 * (\`--check\` guards drift in CI). Platform-agnostic data (no DOM), so the web
 * (\`<svg>\`) renderers draw from ONE source: a
 * 24×24 single path + brand hex.
 */

export type BrandName =
${union};

export type BrandMark = {
  /** Display name (accessible label). */
  title: string;
  /** Official brand colour, if a consumer wants to tint. Renderers default to \`currentColor\`. */
  hex: string;
  /** Single 24×24 path, \`fill: currentColor\`. */
  path: string;
};

export const BRANDS: Record<BrandName, BrandMark> = {
${entries}
};

/** All brand names (for iterating a social row). */
export const BRAND_NAMES = Object.keys(BRANDS) as BrandName[];

/** True when a string is a known brand (narrows to \`BrandName\`). */
export const isBrand = (value: string): value is BrandName => value in BRANDS;
`;

// Resolve the repo's prettier config so the generated file matches format:check.
const prettierOptions = (await prettier.resolveConfig(OUT)) ?? {};
const content = await prettier.format(raw, {
  ...prettierOptions,
  parser: "typescript",
});

if (CHECK) {
  let current = "";
  try {
    current = readFileSync(OUT, "utf8");
  } catch {
    /* missing → stale */
  }
  if (current !== content) {
    console.error("✗ brands.ts is out of date — run `pnpm brands:build`.");
    process.exit(1);
  }
  console.log("✓ brands.ts in sync.");
} else {
  writeFileSync(OUT, content);
  console.log(`✓ Wrote brands.ts (${names.length} marks).`);
}
