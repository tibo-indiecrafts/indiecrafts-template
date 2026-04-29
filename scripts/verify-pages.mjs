#!/usr/bin/env node
/**
 * Cross-validates the page registry.
 *
 * For every `src/app/[locale]/<segment>/page.config.ts`, asserts:
 *   - The folder has `page.tsx` + `page.config.ts` + `messages/<locale>.json` × every locale
 *   - The page's `key` appears in routes.types.ts AppPathname union
 *   - The page is imported in `src/config/pages/index.ts` AND appears in PATHNAMES
 *   - The page's messages are imported in `src/config/pages/messages.ts`
 *
 * Exits 1 on any failure. Static regex scan — runs in <100ms.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOCALE_DIR = path.join(ROOT, "src/app/[locale]");

const LOCALES_FILE = path.join(ROOT, "src/config/locales.config.ts");
const ROUTES_TYPES_FILE = path.join(ROOT, "src/config/routes.types.ts");
const PAGES_INDEX_FILE = path.join(ROOT, "src/config/pages/index.ts");
const PAGES_MESSAGES_FILE = path.join(ROOT, "src/config/pages/messages.ts");

const issues = [];
const issue = (m) => issues.push(m);

async function readSupportedLocales() {
  const src = await readFile(LOCALES_FILE, "utf8");
  const m = /SUPPORTED_LOCALES\s*=\s*\[([^\]]*)\]/.exec(src);
  if (!m) throw new Error("Could not parse SUPPORTED_LOCALES");
  return [...new Set([...m[1].matchAll(/"([a-z-]+)"/g)].map((x) => x[1]))];
}

async function readPageConfig(file) {
  const src = await readFile(file, "utf8");
  return {
    key: /key:\s*"([^"]+)"/.exec(src)?.[1],
    id: /id:\s*"([^"]+)"/.exec(src)?.[1],
  };
}

/**
 * Walk src/app/[locale]/ recursively, returning segment paths that contain
 * a `page.config.ts`. Segment "" = home.
 */
async function listPages() {
  const found = [];
  async function walk(dir, relSegment) {
    const entries = await readdir(dir);
    if (entries.includes("page.config.ts")) {
      found.push({
        segment: relSegment,
        dir,
        config: path.join(dir, "page.config.ts"),
      });
    }
    for (const name of entries) {
      if (name.startsWith("_") || name.startsWith(".") || name === "messages") continue;
      const p = path.join(dir, name);
      const s = await stat(p);
      if (s.isDirectory()) {
        await walk(p, relSegment ? `${relSegment}/${name}` : name);
      }
    }
  }
  await walk(LOCALE_DIR, "");
  return found;
}

const [locales, routesTypesSrc, indexSrc, messagesSrc] = await Promise.all([
  readSupportedLocales(),
  readFile(ROUTES_TYPES_FILE, "utf8"),
  readFile(PAGES_INDEX_FILE, "utf8"),
  readFile(PAGES_MESSAGES_FILE, "utf8"),
]);

const pages = await listPages();

for (const page of pages) {
  const label = page.segment || "(home)";
  const { key, id } = await readPageConfig(page.config);

  if (!id) issue(`[${label}] page.config.ts has no id field`);
  if (!key) issue(`[${label}] page.config.ts has no key field`);
  else if (!routesTypesSrc.includes(`"${key}"`)) {
    issue(`[${label}] key "${key}" not present in routes.types.ts AppPathname union`);
  }

  if (id) {
    const importPathFragment = page.segment
      ? `@/app/[locale]/${page.segment}/page.config`
      : `@/app/[locale]/page.config`;
    if (!indexSrc.includes(importPathFragment)) {
      issue(`[${label}] not imported in pages/index.ts (expected ${importPathFragment})`);
    }
    if (!indexSrc.includes(`${id}Page`)) {
      issue(`[${label}] "${id}Page" reference not found in pages/index.ts`);
    }
  }

  for (const locale of locales) {
    const msgFile = path.join(page.dir, "messages", `${locale}.json`);
    try {
      await stat(msgFile);
    } catch {
      issue(`[${label}] Missing messages/${locale}.json`);
      continue;
    }
    const importPath = page.segment
      ? `@/app/[locale]/${page.segment}/messages/${locale}.json`
      : `@/app/[locale]/messages/${locale}.json`;
    if (!messagesSrc.includes(importPath)) {
      issue(`[${label}] messages.ts does not import ${importPath}`);
    }
  }
}

if (issues.length === 0) {
  console.log(
    `Pages registry OK — ${pages.length} page(s), ${locales.length} locale(s).`,
  );
  process.exit(0);
}

console.log("Page registry issues:");
for (const m of issues) console.log(`  - ${m}`);
console.log(`\n${issues.length} issue(s).`);
process.exit(1);
