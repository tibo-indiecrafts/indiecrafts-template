#!/usr/bin/env bash
# Stop hook — security scan, REPORT-FIRST (advisory · never blocks). Scans the working
# diff with whatever scanners are installed + nudges the security agent when
# security-sensitive files changed. Committed; each tier is guarded (no-op if the tool is
# absent). Activate the SAST/secret tiers with: `brew install semgrep gitleaks`
# (or `pip install semgrep`). Docs: code/docs/projects/web/website/setup/on-the-fly-checks.md.
root="${CLAUDE_PROJECT_DIR:-.}"
cd "$root" 2>/dev/null || exit 0

# Changed source files in the working tree (staged + unstaged + untracked; strip rename `->`).
files=$(git status --porcelain -uall 2>/dev/null | sed -e 's/^...//' -e 's/.* -> //' \
  | grep -E '^code/.*\.(ts|tsx|mjs)$' | grep -Ev '\.(test|spec|stories)\.|\.d\.ts$')

msg=""

# 1) Sensitive-surface nudge (no install) — auth/crypto/route/env/guard changes.
if printf '%s\n' "$files" | grep -qiE 'api/|/route\.|auth|guard|crypto|middleware|\.env|security|token'; then
  msg="${msg}  • Security-sensitive files changed — consider a pass with the \`security-auditor\` / \`code-reviewer\` agent on the diff (auth · crypto · tokens · route boundaries).\n"
fi

# 2) semgrep (SAST — the Snyk-Code/Sonar equivalent) on the diff, using the repo ruleset.
if command -v semgrep >/dev/null 2>&1 && [ -f .semgrep.yml ] && [ -n "$files" ]; then
  n=$(printf '%s\n' $files | xargs semgrep --config .semgrep.yml --quiet --json 2>/dev/null \
    | grep -o '"check_id"' | wc -l | tr -d ' ')
  [ "${n:-0}" -gt 0 ] && msg="${msg}  • semgrep: ${n} finding(s) on the diff — run \`semgrep --config .semgrep.yml code/\` to review.\n"
fi

# 3) gitleaks (secret scan) on the uncommitted changes.
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks protect --redact --no-banner -q >/dev/null 2>&1 \
    || msg="${msg}  • gitleaks: possible secret in the working changes — run \`gitleaks protect --redact\`.\n"
fi

# 4) pnpm audit (dependency vulns — Snyk-OSS equivalent), only when the lockfile changed.
if git status --porcelain 2>/dev/null | grep -q 'pnpm-lock.yaml'; then
  pnpm audit --audit-level=high >/dev/null 2>&1 \
    || msg="${msg}  • pnpm audit: a high/critical dependency advisory — run \`pnpm audit\`.\n"
fi

[ -n "$msg" ] && printf 'Security scan (advisory · report-first):\n%b' "$msg"
exit 0
