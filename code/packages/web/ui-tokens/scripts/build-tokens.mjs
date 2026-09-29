#!/usr/bin/env node
/**
 * Token generator — the source `../src/shared/tokens.json` (DTCG 2025.10, holds
 * primitive + semantic + the central component tier) PLUS colocated
 * `<Component>.tokens.json` fragments (component tier only, next to each component)
 * → two outputs. NEVER hand-edit the generated files; edit the JSON +
 * run `pnpm tokens:build` (or `--check` to verify sync).
 *
 *   1. ../src/generated/tokens.css  — web: :root (light) + the two dark blocks.
 *   2. ../src/generated/hex.ts      — the resolved hex mirror of every semantic color (light + dark),
 *      for places that cannot read oklch() or CSS vars: the PWA manifest and email.
 *
 * Colocated fragments: `{ "component": { "<name>": { "$type", "$value": "{semantic.x}" } } }`.
 * They may ONLY add to the component tier, reference only `{semantic.*}`/`{component.*}`
 * (never a primitive or raw value), and must use globally-unique token names.
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { converter } from "culori";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const CENTRAL = here("../src/shared/tokens.json");
// Glob root for colocated fragments. Overridable (TOKENS_CODE_DIR) so a test can
// point it at a fixture dir; defaults to the repo's code/ tree.
const CODE_DIR = (process.env.TOKENS_CODE_DIR || here("../../../../")).replace(
  /\/$/,
  "",
); // .../code
const tokens = JSON.parse(readFileSync(CENTRAL, "utf8"));
const toRgb = converter("rgb");

const CHECK = process.argv.slice(2).includes("--check");

// ── ref helpers ──────────────────────────────────────────────────────
const node = (path) => path.split(".").reduce((o, k) => o?.[k], tokens);
const isRef = (v) =>
  typeof v === "string" && v.startsWith("{") && v.endsWith("}");
const refPath = (v) => v.slice(1, -1);

// ── merge colocated component fragments ──────────────────────────────
/** Recursively collect every `*.tokens.json` under code/, minus node_modules + the central source. */
function findFragments(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = `${dir}/${name}`;
    const st = statSync(full);
    if (st.isDirectory()) findFragments(full, acc);
    else if (name.endsWith(".tokens.json") && full !== CENTRAL) acc.push(full);
  }
  return acc;
}

// mergedComponent = central component tier (base) + every colocated fragment.
const mergedComponent = {};
for (const [k, v] of Object.entries(tokens.component))
  if (k !== "$description") mergedComponent[k] = v;
const componentSource = {}; // name -> file, for duplicate errors

const fragmentFiles = findFragments(CODE_DIR);
for (const file of fragmentFiles) {
  let frag;
  try {
    frag = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`invalid JSON in ${file}: ${e.message}`);
  }
  for (const key of Object.keys(frag)) {
    if (key === "$description") continue;
    if (key !== "component")
      throw new Error(
        `${file}: colocated token files may only add to "component" (found "${key}"). Primitives/semantics stay central.`,
      );
  }
  for (const [name, tok] of Object.entries(frag.component ?? {})) {
    if (name === "$description") continue;
    if (mergedComponent[name])
      throw new Error(
        `duplicate component token "${name}" in ${file} (already defined${componentSource[name] ? ` in ${componentSource[name]}` : " centrally"}). Namespace by component (e.g. button-${name}).`,
      );
    const v = tok.$value;
    if (isRef(v)) {
      const p = refPath(v);
      if (!p.startsWith("semantic.") && !p.startsWith("component."))
        throw new Error(
          `${file}: token "${name}" references {${p}} — component tokens may reference only {semantic.*} or {component.*}, never a primitive or raw value.`,
        );
    }
    mergedComponent[name] = tok;
    componentSource[name] = file;
  }
}

// ── drift: a sidecar must cover every token its sibling component uses PLAIN ──
// Forward + plain-occurrence only: we flag a token the `.tsx` uses as a bare
// `bg-<token>` (no `/opacity`, no arbitrary value, no literal) that the sidecar
// omits — the real staleness risk when someone edits the component. Opacity-only
// usages are intentionally NOT required (they are an authoring judgement call),
// so this can never false-positive on that debate.
const VOCAB = [
  ...Object.keys(tokens.semantic.light),
  ...Object.keys(tokens.component).filter((k) => k !== "$description"),
].sort((a, b) => b.length - a.length); // longest first so `accent-foreground` wins over `accent`
const PREFIX =
  "bg|text|border|ring|fill|stroke|outline|from|via|to|divide|caret|decoration|shadow";
const USE_RE = new RegExp(
  `(?<![\\w-])(?:${PREFIX})-(${VOCAB.join("|")})(?![\\w/-])`,
  "g",
);

/** Tail token name a sidecar entry references, e.g. {semantic.ring} -> "ring". */
const declaredTails = (frag) =>
  new Set(
    Object.values(frag.component ?? {})
      .map((t) => t.$value)
      .filter(isRef)
      .map((v) => refPath(v).split(".").pop()),
  );

function checkDrift() {
  const issues = [];
  for (const file of fragmentFiles) {
    const tsx = file.replace(/\.tokens\.json$/, ".tsx");
    let source;
    try {
      source = readFileSync(tsx, "utf8");
    } catch {
      continue;
    } // no sibling component — skip
    const declared = declaredTails(JSON.parse(readFileSync(file, "utf8")));
    const used = new Set([...source.matchAll(USE_RE)].map((m) => m[1]));
    const missing = [...used].filter((tok) => !declared.has(tok));
    if (missing.length) issues.push({ file, tsx, missing });
  }
  return issues;
}

/** Follow a value through primitive/dimension aliases to its concrete `$value`. */
function concrete(value) {
  let v = value;
  while (isRef(v)) v = node(refPath(v)).$value;
  return v;
}

const num = (n) => String(n);
function colorCss(v) {
  const c = v.components;
  if (v.colorSpace === "oklch")
    return `oklch(${num(c[0])} ${num(c[1])} ${num(c[2])})`;
  if (v.colorSpace === "hsl")
    return `hsl(${num(c[0])} ${num(c[1])}% ${num(c[2])}%)`;
  throw new Error(`unsupported colorSpace: ${v.colorSpace}`);
}
const dimCss = (v) => `${v.value}${v.unit}`;
function toHex(v) {
  if (v.colorSpace === "oklch")
    return hex({
      mode: "oklch",
      l: v.components[0],
      c: v.components[1],
      h: v.components[2],
    });
  if (v.colorSpace === "hsl")
    return hex({
      mode: "hsl",
      h: v.components[0],
      s: v.components[1] / 100,
      l: v.components[2] / 100,
    });
  throw new Error(`cannot hex a ${v.colorSpace}`);
}
function hex(color) {
  const { r, g, b } = toRgb(color);
  const ch = (x) =>
    Math.round(Math.max(0, Math.min(1, x)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(r)}${ch(g)}${ch(b)}`;
}

// ── CSS emission ─────────────────────────────────────────────────────
/** One `--name: <value>;`. Semantic/component-slot refs stay var() so the cascade re-themes. */
function cssDecl(name, value) {
  if (isRef(value)) {
    const p = refPath(value);
    if (p.startsWith("semantic.") || p.startsWith("component."))
      return `  --${name}: var(--${p.split(".").pop()});`;
  }
  const v = concrete(value);
  if (v && v.colorSpace) return `  --${name}: ${colorCss(v)};`;
  if (v && "unit" in v) return `  --${name}: ${dimCss(v)};`;
  throw new Error(`cannot emit --${name}`);
}
const semanticBlock = (theme) =>
  Object.entries(tokens.semantic[theme])
    .map(([name, t]) => cssDecl(name, t.$value))
    .join("\n");

function buildCss() {
  const light = [
    semanticBlock("light"),
    `  --radius: ${dimCss(concrete(tokens.semantic.radius.$value))};`,
    ...Object.entries(mergedComponent).map(([name, t]) =>
      cssDecl(name, t.$value),
    ),
  ].join("\n");
  const dark = semanticBlock("dark");
  return `/* GENERATED by scripts/build-tokens.mjs from src/shared/tokens.json + colocated *.tokens.json — DO NOT EDIT.
   Run \`pnpm tokens:build\` after editing a token source. */

:root {
${light}
}

/* OS preference — only when data-theme isn't forcing light. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${dark.replace(/^ {2}/gm, "    ")}
  }
}

/* Explicit toggle (next-themes) + any nested data-theme="dark" subtree. */
:root[data-theme="dark"],
[data-theme="dark"] {
${dark}
}
`;
}

// ── hex ─────────────────────────────────────────────────────
/** Resolve a token to hex for a theme — semantic + component slots resolve through it. */
function resolveHex(value, theme) {
  let v = value;
  while (isRef(v)) {
    const p = refPath(v);
    if (p.startsWith("semantic."))
      v = tokens.semantic[theme][p.split(".").pop()].$value;
    else if (p.startsWith("component."))
      v = mergedComponent[p.split(".").pop()].$value;
    else v = node(p).$value;
  }
  return toHex(v);
}
/** Every SEMANTIC color role resolved to hex for one theme (component tokens stay CSS-only). */
function semanticHex(theme) {
  const out = {};
  for (const [name, t] of Object.entries(tokens.semantic[theme]))
    out[name] = resolveHex(t.$value, theme);
  return out;
}
function buildHex() {
  const block = (o) =>
    Object.entries(o)
      .map(([k, v]) => `    "${k}": "${v}",`)
      .join("\n");
  return `// GENERATED by scripts/build-tokens.mjs — DO NOT EDIT.
// Resolved hex mirror of every semantic color role — for places that cannot read oklch()
// or CSS variables: the PWA manifest and email templates.
export const hexColors = {
  light: {
${block(semanticHex("light"))}
  },
  dark: {
${block(semanticHex("dark"))}
  },
} as const;
`;
}

// ── write / check ────────────────────────────────────────────────────
// VALIDATE_ONLY (tests): run merge + drift against a fixture tree, skip the
// disk-diff — the generated files reflect the real code/ tree, not a fixture.
const VALIDATE_ONLY = !!process.env.TOKENS_VALIDATE_ONLY;
const nColo = Object.keys(componentSource).length;
const drift = checkDrift();
if (drift.length) {
  for (const { tsx, missing } of drift)
    console.error(
      `✗ drift: ${tsx} uses ${missing.map((t) => `\`${t}\``).join(", ")} but its .tokens.json omits ${missing.length === 1 ? "it" : "them"}.`,
    );
}
if (VALIDATE_ONLY) {
  if (drift.length) process.exit(1);
  console.log(
    `✓ validate — ${nColo} component tokens, ${fragmentFiles.length} sidecars, no drift`,
  );
  process.exit(0);
}

const outputs = [
  ["../src/generated/tokens.css", buildCss()],
  ["../src/generated/hex.ts", buildHex()],
];
mkdirSync(here("../src/generated"), { recursive: true });

let stale = 0;
for (const [rel, content] of outputs) {
  const path = here(rel);
  if (CHECK) {
    let current = "";
    try {
      current = readFileSync(path, "utf8");
    } catch {}
    if (current !== content) {
      stale++;
      console.error(`✗ stale: ${rel}`);
    }
  } else {
    writeFileSync(path, content);
    console.log(`✓ wrote ${rel}`);
  }
}
if (CHECK) {
  if (stale) {
    console.error(
      `\n✗ tokens:check FAILED — ${stale} file(s) out of sync. Run \`pnpm tokens:build\`.`,
    );
    process.exit(1);
  }
  if (drift.length) {
    console.error(
      `\n✗ tokens:check FAILED — ${drift.length} sidecar(s) drifted from their component. Add the missing token(s) to the .tokens.json.`,
    );
    process.exit(1);
  }
  console.log(
    `✓ tokens:check — in sync (${nColo} colocated component token${nColo === 1 ? "" : "s"} merged, ${fragmentFiles.length} sidecars drift-checked)`,
  );
} else {
  if (drift.length)
    console.log(
      `  (${drift.length} sidecar(s) drifted — see ✗ above; run \`pnpm tokens:check\` details)`,
    );
  console.log(
    `  (${nColo} colocated component token${nColo === 1 ? "" : "s"} merged from *.tokens.json)`,
  );
}
