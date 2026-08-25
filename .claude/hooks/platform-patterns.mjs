#!/usr/bin/env node
/**
 * PostToolUse (Edit|Write|MultiEdit) — platform-pattern cards. Flags web-only patterns
 * imported into a NATIVE or HYBRID source file, on the just-edited file:
 *   • `@indiecrafts/packages-web-ui` / `-web-ui-components` (shadcn/DOM design system)
 *   • a shadcn UI path import (`@/user-interface/ui/…`, `@/components/ui/…`)
 * The rule (DESIGN.md § Platform patterns): tokens + design decisions cross platforms;
 * shadcn/DOM/Tailwind *implementation* does not — native uses `ui-native` + RN idioms.
 * Advisory (never blocks). No-op outside mobile/hybrid source.
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

// Only native/hybrid source under a platform folder (projects|packages|modules → mobile|hybrid).
// Web + shared bricks are the legit home for web-ui imports, so they are skipped.
const isNativeOrHybrid =
  /\.(?:ts|tsx|js|jsx)$/.test(file) &&
  /[/\\]code[/\\](?:projects|packages|modules)[/\\](?:mobile|hybrid)[/\\]/.test(file) &&
  !/\.(stories|test|spec)\.[jt]sx?$/.test(file) &&
  !/(generated|[/\\]node_modules[/\\])/.test(file);
if (!isNativeOrHybrid) process.exit(0);

let src;
try {
  src = readFileSync(file, "utf8");
} catch {
  process.exit(0);
}

const RULES = [
  {
    re: /@indiecrafts\/packages-web-ui(?:-components)?\b/,
    rule: "web-ui-on-native",
    msg: "web-only design system (shadcn/DOM) — native/hybrid share the tokens, not the components. Use `ui-native` + the platform's own primitives.",
  },
  {
    re: /["'`]@\/(?:user-interface|components)\/ui\//,
    rule: "shadcn-import-on-native",
    msg: "shadcn UI import — port the decision, not the web component; use the platform idiom.",
  },
];

const cards = [];
src.split("\n").forEach((line, i) => {
  const t = line.trim();
  if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return; // skip comment lines
  for (const { re, rule, msg } of RULES)
    if (re.test(line)) cards.push({ line: i + 1, rule, msg });
});
if (!cards.length) process.exit(0);

const rel = path.relative(process.env.CLAUDE_PROJECT_DIR || ".", file);
let out = `[platform-patterns] ${cards.length} finding(s) in ${rel}:\n`;
for (const c of cards.slice(0, 15)) out += `  · ${rel}:${c.line} — ${c.rule}: ${c.msg}\n`;
if (cards.length > 15) out += `  · …+${cards.length - 15} more\n`;
out += "Advisory — DESIGN.md § Platform patterns: share the decision, not the implementation.";
process.stdout.write(out);
process.exit(0);
