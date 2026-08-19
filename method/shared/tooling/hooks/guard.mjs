#!/usr/bin/env node
// PreToolUse guard — deny destructive / irreversible tool calls at the SYSTEM level.
//
// The point (per "your instructions are suggestions"): a CLAUDE.md "never do X"
// rule is just early text in a long conversation — obeyed arbitrarily. A rule
// that MUST hold (force-push, prod-data wipe, recursive delete) belongs in a
// PreToolUse hook that intercepts the call BEFORE it runs. This is that hook.
//
// Blocks by exiting 2 with a reason on stderr — Claude Code denies the call and
// shows the reason. Local-only (wired in settings.local.json). It is a SAFETY
// NET, not a sandbox: regex on a shell string can be evaded; it stops the common
// accidents, not a determined bypass. ponytail: known ceiling, deliberate.
import { readFileSync } from "node:fs";

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0); // unparseable → don't block (fail-open; the net is best-effort)
}

const tool = input.tool_name || "";
const cmd = tool === "Bash" ? String(input.tool_input?.command ?? "") : "";

// [label, matches?, how-to-proceed]. Order doesn't matter; first match blocks.
const RULES = [
  [
    "git force-push",
    () =>
      /\bgit\s+push\b/.test(cmd) &&
      /(--force(?!-with-lease)\b|(?:^|\s)-f(?:\s|$))/.test(cmd),
    "Use --force-with-lease (refuses if the remote moved), or run it yourself with `! git push --force …`.",
  ],
  [
    "recursive force-delete (rm -rf)",
    () =>
      /\brm\b/.test(cmd) &&
      (/\brm\s+-\S*r\S*f/.test(cmd) ||
        /\brm\s+-\S*f\S*r/.test(cmd) ||
        /\brm\s+(-rf|-fr)\b/.test(cmd) ||
        (/--recursive/.test(cmd) && /--force/.test(cmd))),
    "Delete specific paths without -rf, or run it yourself with `! rm -rf …` after checking the target.",
  ],
  [
    "wrangler resource delete",
    () => /\bwrangler\b/.test(cmd) && /\bdelete\b/.test(cmd),
    "Deleting a Worker / KV / D1 / R2 / queue is irreversible. Run it yourself with `! wrangler … delete` if intended.",
  ],
  [
    "Sanity write against the production dataset",
    () =>
      /SANITY_API_(WRITE_)?TOKEN\s*=/.test(cmd) && /\bproduction\b/.test(cmd),
    "Point the write at a NON-production dataset (NEXT_PUBLIC_SANITY_DATASET=staging), or run it yourself if you truly mean prod.",
  ],
];

const hit = RULES.find(([, matches]) => matches());
if (hit) {
  const [label, , how] = hit;
  process.stderr.write(
    `Guard: blocked a ${label}. This is a hard boundary (a hook, not a CLAUDE.md suggestion).\n` +
      `${how}\n` +
      `To disable the guard for a session, remove its PreToolUse entry from .claude/settings.local.json.\n`,
  );
  process.exit(2); // PreToolUse exit 2 → deny the tool call, feed stderr to Claude
}

process.exit(0);
