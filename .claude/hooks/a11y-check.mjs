/**
 * lint-check (file: a11y-check.mjs) — on-the-fly LINT cards for the FULL eslint config
 * (jsx-a11y IS a subset; also next core-web-vitals, typescript-eslint, unused-vars, the
 * `no-restricted-imports` next/link ban).
 *
 * Two tiers, one script (mode read from the hook payload on stdin):
 *   • PostToolUse (Edit|Write|MultiEdit) → lint the single edited UI file.
 *   • Stop                              → lint the whole changed UI set, once.
 *
 * Each file is fed to the app's REAL eslint via `--stdin` + an in-base-path
 * `--stdin-filename`, so the exact flat config (the website's eslint.config.mjs — the shared
 * `@indiecrafts/packages-web-quality-config/eslint` every web surface uses) + the TS parser apply — no rule drift, and it works for files
 * outside the website that eslint-config-next would otherwise skip ("File ignored because
 * outside of base path").
 *
 * Findings print as cards (a hook's stdout is surfaced as additional context).
 * NON-BLOCKING by design — the pre-commit hook (lint-staged) + CI stay the hard gate;
 * this is the fast per-edit feedback. Type-aware rules may be partial under `--stdin`
 * per-file — the commit/CI whole-program run is authoritative.
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const APP = path.join(ROOT, "code/projects/web/surfaces/website");
// Synthetic in-base-path name so the app config lints the piped source; the real
// path is substituted back into each card. Any src/*.tsx name works.
const STDIN_NAME = "src/__a11y_hook__.tsx";
const MAX_STOP_FILES = 40; // cap the deep pass so the Stop hook can't run long

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}
if (payload.stop_hook_active === true) process.exit(0); // fire once per stop-chain

const single = payload.tool_input && payload.tool_input.file_path;
const stop = !single;

// Target files (absolute).
let files = [];
if (single) {
  files = [path.resolve(single)];
} else {
  try {
    const out = execFileSync("git", ["-C", ROOT, "status", "--porcelain"], {
      encoding: "utf8",
    });
    files = out
      .split("\n")
      .map((l) => l.slice(3).trim())
      .filter(Boolean)
      .map((f) => path.resolve(ROOT, f));
  } catch {
    process.exit(0);
  }
}

// Keep only UI component sources (skip stories/tests/non-tsx and non-src paths).
// Match the real layouts: code/{packages,modules}/<scope>/<name>/src/ (scope =
// shared|web) AND the nested projects tree
// code/projects/<platform>/<kind>/<name>/src/ (surfaces|services|tools).
const isUI = (f) =>
  /\.(tsx|jsx)$/.test(f) &&
  !/\.(stories|test|spec)\.[jt]sx?$/.test(f) &&
  /[/\\]code[/\\](?:(?:packages|modules)[/\\][^/\\]+[/\\][^/\\]+|projects[/\\][^/\\]+[/\\](?:surfaces|services|tools)[/\\][^/\\]+)[/\\]src[/\\]/.test(
    f,
  );
files = [...new Set(files)].filter(isUI).slice(0, stop ? MAX_STOP_FILES : 1);
if (!files.length) process.exit(0);

function lint(file) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    return [];
  }
  let out = "";
  try {
    out = execFileSync(
      "pnpm",
      [
        "exec",
        "eslint",
        "--stdin",
        "--stdin-filename",
        STDIN_NAME,
        "--format",
        "json",
      ],
      {
        cwd: APP,
        input: src,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
        timeout: stop ? 8000 : 12000,
      },
    );
  } catch (e) {
    // eslint exits non-zero when it reports problems — the JSON is still on stdout.
    out = (e.stdout && e.stdout.toString()) || "";
  }
  const i = out.indexOf("[");
  if (i < 0) return [];
  let results;
  try {
    results = JSON.parse(out.slice(i));
  } catch {
    return [];
  }
  return (results[0]?.messages || [])
    .filter((m) => m.ruleId) // every rule (a11y + next + ts-eslint + import bans); skip syntax noise (no ruleId)
    .map((m) => ({
      line: m.line,
      rule: m.ruleId,
      msg: m.message,
      sev: m.severity === 2 ? "error" : "warn",
    }));
}

const cards = [];
for (const f of files)
  for (const x of lint(f)) cards.push({ file: path.relative(ROOT, f), ...x });
if (!cards.length) process.exit(0);

const a11yCount = cards.filter((c) => c.rule.startsWith("jsx-a11y/")).length;
let out = `[lint] ${cards.length} finding(s)${a11yCount ? ` (${a11yCount} a11y)` : ""} — ${stop ? "deep pass" : "edit"} · full eslint config:\n`;
for (const c of cards.slice(0, 25))
  out += `  · ${c.file}:${c.line} — ${c.sev} ${c.rule}: ${c.msg}\n`;
if (cards.length > 25) out += `  · …+${cards.length - 25} more\n`;
out +=
  "Advisory — the commit hook (lint-staged) + CI are the gate; a11y · next · type · import-ban rules block there.";
process.stdout.write(out);
process.exit(0);
