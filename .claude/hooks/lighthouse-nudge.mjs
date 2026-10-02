#!/usr/bin/env node
// PostToolUse hook — Lighthouse nudge. After a browser navigation (chrome-devtools /
// claude-in-chrome), remind the agent to run a Lighthouse diagnosis on that page: a
// browser check is not done until performance, accessibility, best practices and SEO
// were measured (see .claude/rules/web/visual-verification.md). Advisory — never blocks.
// Fires once per URL per session (a page re-visited in the same session stays quiet).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const url = input.tool_input?.url;
// Only real pages: skip blank tabs, back/forward/reload without a URL, and non-http.
if (typeof url !== "string" || !/^https?:\/\//.test(url)) process.exit(0);

// Once per URL (origin + path) per session.
const page = (() => {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url;
  }
})();
const dir = join(tmpdir(), "claude-lighthouse-nudge");
const seenFile = join(dir, `${input.session_id ?? "session"}.json`);
const seen = existsSync(seenFile)
  ? JSON.parse(readFileSync(seenFile, "utf8"))
  : [];
if (seen.includes(page)) process.exit(0);
mkdirSync(dir, { recursive: true });
writeFileSync(seenFile, JSON.stringify([...seen, page]));

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext:
        `Browser check on ${page}: also run a Lighthouse diagnosis of this page — ` +
        "mcp__chrome-devtools__lighthouse_audit (or headless: npx lighthouse <url> --chrome-flags=--headless). " +
        "Report the performance · accessibility · best-practices · SEO scores and the top issues; " +
        "fix a regression your change caused, or name it as a finding. Dev servers score low on " +
        "performance by design — judge performance on a production build (pnpm build && pnpm start).",
    },
  }),
);
