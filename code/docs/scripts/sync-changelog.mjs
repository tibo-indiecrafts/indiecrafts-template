#!/usr/bin/env node
// Sync the source CHANGELOG.md files into the docs site.
//
// The source changelogs carry relative markdown links authored for THEIR location
// in the code tree. Copied verbatim into the docs site those links are dead. So we
// copy, then neutralize relative links — keep the link text, drop the dead target.
// http(s) links, in-site absolute links (/…), and pure anchors (#…) are kept.
//
// Run from the docs package root (npm sets cwd there): `node scripts/sync-changelog.mjs`.
import { readFileSync, writeFileSync } from "node:fs";

export const PAIRS = [
  [
    "../projects/web/surfaces/website/CHANGELOG.md",
    "projects/web/website/changelog.md",
  ],
  ["../packages/CHANGELOG.md", "packages/changelog.md"],
  ["../modules/CHANGELOG.md", "modules/changelog.md"],
];

// [text](target) -> text, when target is relative (not http(s)://, not /abs, not #anchor).
const RELATIVE_LINK = /\[([^\]]+)\]\((?!https?:\/\/|\/|#)[^)]*\)/g;

export function neutralizeRelativeLinks(md) {
  return md.replace(RELATIVE_LINK, "$1");
}

// Inline `code` containing {{…}} -> <code v-pre>…</code> so VitePress's Vue layer
// renders the braces literally instead of interpolating them (email placeholders).
const BRACED_INLINE_CODE = /`([^`\n]*\{\{[^`\n]*)`/g;

export function protectVueBraces(md) {
  return md.replace(BRACED_INLINE_CODE, "<code v-pre>$1</code>");
}

function main() {
  for (const [src, dst] of PAIRS) {
    const out = protectVueBraces(
      neutralizeRelativeLinks(readFileSync(src, "utf8")),
    );
    writeFileSync(dst, out);
  }
  console.log(`synced ${PAIRS.length} changelog page(s)`);
}

// Run only when invoked directly, not when imported by the test.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) main();
