#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit) — config-first cards. Flags the raw values the
 * repo's NEVERs ban but eslint doesn't catch, on the just-edited component file:
 *   • raw COLOR literals (`design-token-usage`: use a semantic token — `bg-brand`,
 *     `text-muted-foreground` — never a hex / rgb / hsl / oklch or a `bg-[#…]` arbitrary)
 *   • hardcoded absolute URLs (read brand/site URLs from `@/config`, not inline)
 * Advisory (never blocks); the `config-consistency-reviewer` agent does the full pass
 * on demand, the commit hook + CI stay the gate. No-op outside the component layer.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}
const file = input?.tool_input?.file_path ?? "";

// Only the component layer, where raw colors/URLs are clear violations. Skip the
// legit homes for literals: config, seo/jsonld, sanity, ui-tokens, the shadcn
// primitives (CLI-managed), generated output, tests/stories, and non-component files.
const isComponent =
  /\.tsx$/.test(file) &&
  /[/\\]code[/\\](?:projects|packages|modules)[/\\].*[/\\]src[/\\]/.test(file) &&
  !/\.(stories|test|spec)\.tsx$/.test(file) &&
  !/(generated|[/\\]config[/\\]|[/\\]seo[/\\]|jsonld|[/\\]sanity[/\\]|ui-tokens|packages[/\\]web[/\\]ui[/\\]src[/\\]web[/\\])/.test(
    file,
  );
if (!isComponent) process.exit(0);

let src;
try {
  src = readFileSync(file, "utf8");
} catch {
  process.exit(0);
}

// URLs that are legitimately inline (schemas, standards, local dev, CDN hosts, the
// placeholder origin) — not brand/site URLs that belong in @/config.
const URL_OK =
  /(schema\.org|w3\.org|localhost|127\.0\.0\.1|example\.com|sanity\.io|unsplash\.com|googleapis\.com|gstatic\.com)/;
const COLOR =
  /-\[#[0-9a-fA-F]{3,8}\]|#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/;
const URL = /https?:\/\/[^\s"'`)<>]+/;

const cards = [];
src.split("\n").forEach((line, i) => {
  const t = line.trim();
  if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return; // skip comment lines
  if (COLOR.test(line)) cards.push({ line: i + 1, rule: "raw-color", msg: "raw color — use a semantic token (bg-brand · text-muted-foreground), never a hex/rgb/hsl/oklch." });
  const u = line.match(URL);
  if (u && !URL_OK.test(u[0])) cards.push({ line: i + 1, rule: "hardcoded-url", msg: `hardcoded URL (${u[0].slice(0, 48)}) — read it from @/config.` });
});
if (!cards.length) process.exit(0);

const rel = path.relative(process.env.CLAUDE_PROJECT_DIR || ".", file);
let out = `[config-first] ${cards.length} finding(s) in ${rel}:\n`;
for (const c of cards.slice(0, 15)) out += `  · ${rel}:${c.line} — ${c.rule}: ${c.msg}\n`;
if (cards.length > 15) out += `  · …+${cards.length - 15} more\n`;
out += "Advisory — config-first NEVERs (tokens · @/config). Full pass: the config-consistency-reviewer agent.";
process.stdout.write(out);
process.exit(0);
