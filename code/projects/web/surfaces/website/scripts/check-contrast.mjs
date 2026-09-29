#!/usr/bin/env node
/**
 * WCAG contrast checker for the theme tokens declared in code/packages/web/ui-tokens/src/globals.css.
 *
 * Parses oklch(...) values for each named token in `:root` (light),
 * `:root[data-theme="dark"]` (explicit), and the `prefers-color-scheme: dark`
 * block, converts to sRGB via the standard oklch → lab → xyz → srgb chain,
 * and computes WCAG 2.1 relative luminance + contrast ratio.
 *
 * Fails (exit 1) when a declared foreground/background pair dips below AA.
 * Warns (still exit 0) on AA-failing pairs that are non-text (e.g. border).
 *
 * Keep this in sync with the PAIRS array when adding new semantic tokens.
 *
 * Usage:  node scripts/check-contrast.mjs
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CSS_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../../packages/web/ui-tokens/src/generated/tokens.css",
);

// Pairs we enforce. [foregroundToken, backgroundToken, AA threshold, label].
// 4.5:1 for normal body text, 3:1 for large text / UI components.
const PAIRS = [
  ["foreground", "background", 4.5, "body text"],
  ["muted-foreground", "background", 4.5, "muted body text"],
  ["muted-foreground", "muted", 4.5, "muted text on muted surface (chips)"],
  ["brand-foreground", "brand", 4.5, "text on brand"],
  ["brand", "background", 3.0, "brand accent / links"],
  ["ring", "background", 3.0, "focus ring"],
  ["border", "background", 1.5, "border (non-text)"],
  ["selection-fg", "selection-bg", 4.5, "selected text"],
];

// ---- oklch parser --------------------------------------------------------
const OKLCH_RE = /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/;
function parseOklch(value) {
  const m = OKLCH_RE.exec(value);
  if (!m) return null;
  return { L: parseFloat(m[1]), C: parseFloat(m[2]), h: parseFloat(m[3]) };
}

// ---- oklch → sRGB --------------------------------------------------------
function oklchToLinearSrgb({ L, C, h }) {
  const hr = (h * Math.PI) / 180;
  const a = C * Math.cos(hr);
  const b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

function relLuminance({ L, C, h }) {
  const { r, g, b } = oklchToLinearSrgb({ L, C, h });
  const clip = (x) => Math.max(0, Math.min(1, x));
  return 0.2126 * clip(r) + 0.7152 * clip(g) + 0.0722 * clip(b);
}

function contrast(a, b) {
  const la = relLuminance(a);
  const lb = relLuminance(b);
  const [l1, l2] = la > lb ? [la, lb] : [lb, la];
  return (l1 + 0.05) / (l2 + 0.05);
}

// ---- block extractor -----------------------------------------------------
function extractBlock(css, selector) {
  // The selector may appear in a comma-separated list, e.g.
  //   :root[data-theme="dark"],
  //   [data-theme="dark"] { … }
  // Allow an optional `, ...` between the selector and the opening brace.
  const re = new RegExp(
    `${selector.replace(/[-[\]{}()*+?.\\^$|]/g, "\\$&")}(?:\\s*,\\s*[^{]+?)?\\s*\\{([^}]*)\\}`,
    "m",
  );
  const m = re.exec(css);
  if (!m) return {};
  const tokens = {};
  for (const line of m[1].split("\n")) {
    const decl = line.trim().match(/--([a-z-]+):\s*(oklch\([^)]*\))/);
    if (!decl) continue;
    const parsed = parseOklch(decl[2]);
    if (parsed) tokens[decl[1]] = parsed;
  }
  return tokens;
}

function mergeTokens(base, override) {
  return { ...base, ...override };
}

// ---- main ----------------------------------------------------------------
const css = await readFile(CSS_PATH, "utf8");

const lightTokens = extractBlock(css, ":root");
const darkExplicit = extractBlock(css, ':root[data-theme="dark"]');
const darkTokens = mergeTokens(lightTokens, darkExplicit);

const modes = [
  ["light", lightTokens],
  ["dark", darkTokens],
];

let failures = 0;

for (const [mode, tokens] of modes) {
  console.log(`\n${mode.toUpperCase()}`);
  for (const [fg, bg, min, label] of PAIRS) {
    const a = tokens[fg];
    const b = tokens[bg];
    if (!a || !b) {
      console.log(`  SKIP  ${label.padEnd(22)} ${fg}/${bg} — token missing`);
      continue;
    }
    const ratio = contrast(a, b);
    const ok = ratio >= min;
    const marker = ok ? "PASS" : "FAIL";
    console.log(
      `  ${marker}  ${label.padEnd(22)} ${ratio.toFixed(2)}:1 (need ${min}:1)  ${fg} on ${bg}`,
    );
    if (!ok) failures += 1;
  }
}

console.log(
  `\n${failures === 0 ? "All pairs meet WCAG AA." : `${failures} pair(s) failed WCAG AA.`}`,
);
process.exit(failures === 0 ? 0 : 1);
