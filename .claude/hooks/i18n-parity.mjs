#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit) — i18n message-key parity. When a
 * `messages/<locale>.json` is edited, compare every locale file in that directory
 * against the base locale (`en`) and card any missing/extra keys. Only the website
 * has a parity TEST (`messages/messages.test.ts`); this covers EVERY surface
 * (app · mobile · hybrid) live. Advisory (never blocks); a missing key renders the
 * raw id at runtime, so it is worth catching as you type. No-op for other files.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}
const file = input?.tool_input?.file_path ?? "";
if (!/[/\\]messages[/\\][a-z]{2}(-[A-Z]{2})?\.json$/.test(file)) process.exit(0);

const dir = path.dirname(file);
const BASE = "en.json";

const flat = (o, p = "", out = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, out);
    else out[key] = true;
  }
  return out;
};
const load = (f) => {
  try {
    return flat(JSON.parse(readFileSync(f, "utf8")));
  } catch {
    return null;
  }
};

let locales;
try {
  locales = readdirSync(dir).filter((f) => /^[a-z]{2}(-[A-Z]{2})?\.json$/.test(f));
} catch {
  process.exit(0);
}
if (!locales.includes(BASE)) process.exit(0); // no base locale to compare against
const base = load(path.join(dir, BASE));
if (!base) process.exit(0);
const baseKeys = Object.keys(base);

const cards = [];
const preview = (a) => `${a.slice(0, 5).join(", ")}${a.length > 5 ? ", …" : ""}`;
for (const loc of locales) {
  if (loc === BASE) continue;
  const keys = load(path.join(dir, loc));
  if (!keys) continue;
  const missing = baseKeys.filter((k) => !(k in keys));
  const extra = Object.keys(keys).filter((k) => !(k in base));
  if (missing.length) cards.push(`${loc}: ${missing.length} missing vs en (${preview(missing)})`);
  if (extra.length) cards.push(`${loc}: ${extra.length} not in en (${preview(extra)})`);
}
if (!cards.length) process.exit(0);

const rel = path.relative(process.env.CLAUDE_PROJECT_DIR || ".", dir);
let out = `[i18n] message-key parity drift in ${rel}:\n`;
for (const c of cards) out += `  · ${c}\n`;
out += "Align the locales — a key present in one file but not another renders the raw id at runtime.";
process.stdout.write(out);
process.exit(0);
