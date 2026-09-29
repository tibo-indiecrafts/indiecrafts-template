---
title: "On-the-fly quality checks"
description: "Feedback fires in tiers, fastest first: cards as code is written, a hard gate at commit, deep scans on demand."
status: stable
---

# On-the-fly quality checks

Feedback fires in **tiers**, fastest first: cards as code is written, a hard gate at commit,
deep scans on demand. Nothing here is a manual scan you have to remember to run.

## The tiers

| Tier       | Fires                                                                       | Runs                                                                                                                                                                                                                                                                                                                                                          | Blocks?                                                                |
| ---------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **pre**    | before a `Bash` tool call (`PreToolUse` hook)                               | **guard** — deny destructive ops (force-push · `rm -rf` · `wrangler … delete` · prod-dataset Sanity write)                                                                                                                                                                                                                                                    | **yes — denies the call**                                              |
| **edit**   | after every `Edit` / `Write` / `MultiEdit` (Claude Code `PostToolUse` hook) | design cards (impeccable) + **lint cards** (the FULL eslint config — a11y · next core-web-vitals · typescript-eslint · the `next/link` import ban) + **config-first cards** (raw color / hardcoded-URL) + **i18n key-parity** (on `messages/*.json`) + **tokens auto-regen** (on `tokens.json`) + **live type diagnostics** (the `typescript-lsp` plugin)     | no — cards / auto-fix                                                  |
| **plan**   | before `ExitPlanMode` (`PreToolUse` hook, `settings.local.json`, personal)  | **grill-plan** — run a hard grill-me stress-test of the plan first (needs the `grill-me` skill) · **plan-review-nudge** — suggest a gstack plan review (`/autoplan` · `/plan-eng-review`) before approval                                                                                                                                                     | no — advise                                                            |
| **stop**   | at turn end (`Stop` hook)                                                   | design deep pass + **lint deep pass** + **change-hygiene** (docs **and** tests) + **CLAUDE.md hygiene** (proposes a brief review when a unit's surface grew) + **security-scan** (semgrep · gitleaks · `pnpm audit` · sensitive-file agent nudge — report-first) + **visual-verify** (UI changed → screenshot) + **review-nudge** (diff scan → gstack review) | change-hygiene + visual-verify block; the rest advise                  |
| **commit** | `git commit` (husky)                                                        | `lint-staged` (eslint `jsx-a11y` + prettier on staged) then `tsc`                                                                                                                                                                                                                                                                                             | **yes — hard gate**                                                    |
| **scan**   | on demand / CI                                                              | `pnpm verify` (tsc · lint · contrast · react-doctor · test) · **`pnpm test:stories`** (every Storybook story = a component + a11y test; the CI `browser-stories` job **blocks** on it) · `pnpm shadscan` · axe E2E · **`pnpm size`** (marketing First-Load JS budget, excl. Studio — CI, report-first)                                                        | manual / CI (story tests **block**; size report-only until calibrated) |

The edit + stop tiers are **cards** — fast, advisory, no block. Correctness is still enforced at
**commit** and in CI. The point is to see a problem the second you write it, not at commit.

**No manual pre-PR ritual.** Because lint is now a live card (the full config, not just a11y) and types
come from the `typescript-lsp` plugin in real time, you don't run `pnpm verify:quick` by hand before a
PR — the **commit hook** (`lint-staged` + `tsc`) + **CI** enforce it, and the live tiers give the same
feedback continuously. Reach for a manual `verify:quick`/`verify` only to reproduce a specific CI
failure. (The briefs were updated to drop the old "run verify:quick before every PR" advice.)

## The hooks are local by design (nothing ships)

The **hook scripts** (`.claude/hooks/*` — `guard.mjs` · `a11y-check.mjs` · `config-first.mjs` ·
`i18n-parity.mjs` · `tokens-fresh.mjs` · `change-hygiene.sh` · `review-nudge.sh`, plus the opt-in
`visual-verify.sh` / `plan-review-nudge.sh`) are **committed** — they ship with the repo so the whole
team shares one set of dev-quality gates (allowlisted in `.gitignore` alongside `agents/`, `skills/`,
`settings.json`). Their **wiring is split**: the repo hooks are wired in the committed
`.claude/settings.json` (`guard` PreToolUse · `a11y-check` PostToolUse · `change-hygiene` Stop);
machine-local or global additions (personal approvals, the global `impeccable` design card) live in
`.claude/settings.local.json`, which stays **gitignored**.

**They don't reach a client.** The client hand-off strips root `.claude/` entirely, so the studio's
gates never run on a client's machine even though they're committed here.

**Fresh clone → hooks work.** Both the scripts and the repo wiring are tracked, so a fresh clone gets
them directly — Claude Code just prompts to **approve** the project-settings hooks on first run. (The
`impeccable` design card additionally needs the global `~/.claude/skills/impeccable` skill, which only
exists on the studio's machines.)

`visual-verify.sh` is committed but **not wired** by default (it overlaps the impeccable + change-hygiene
Stop hooks) — add a `Stop` entry in `.claude/settings.json` to enable it. (`tokens-fresh.mjs` is now
wired as a `PostToolUse` hook.)

## Lint on the fly (a11y is a subset)

`.claude/hooks/a11y-check.mjs` (a repo-owned `PostToolUse` + `Stop` hook) surfaces **the full eslint
config** as cards — `jsx-a11y` (alt text · labels · roles · aria · keyboard) **plus** next
core-web-vitals, typescript-eslint (unused vars, …), and the `no-restricted-imports` `next/link` ban.
It already ran the whole config; it now shows every finding, not only the a11y ones (the a11y count is
called out in the card).

- **Exact rules, no drift** — it feeds each file to the app's real eslint via `--stdin` with an
  in-base-path `--stdin-filename`, so the flat config in
  [`code/projects/web/surfaces/website/eslint.config.mjs`](../../../../code/projects/web/surfaces/website/eslint.config.mjs)
  applies verbatim.
- **Covers files anywhere** — app, packages, and modules. The `--stdin` trick sidesteps
  `eslint-config-next`'s "outside base path" skip, so UI moved into `@indiecrafts/packages-web-ui/web`,
  `ui-components/web`, etc. is checked too.
- **Edit tier** lints the one edited file; **Stop tier** re-lints the whole changed UI set once.
- **Non-blocking + partial type-awareness** — type-aware rules may be incomplete under per-file
  `--stdin`; the **commit** hook (`lint-staged`) + CI (whole-program `tsc` + `lint`) stay the hard gate,
  and `pnpm verify:contrast` + axe E2E cover the runtime/color side.

Its design twin is the **impeccable** hook (spacing · color · hierarchy). One judges look, the other
judges lint + structural a11y.

## Types on the fly — the `typescript-lsp` plugin

Per-file `tsc` is **not** feasible here (whole-program: `moduleResolution: bundler` + cross-package
`paths` → typechecking one file pulls its whole import graph). So live type feedback comes from the
official **`typescript-lsp`** Claude Code plugin — real-time LSP diagnostics as you edit, the same
engine your editor uses. Install it once (machine-level, like the Cloudflare skills in
[environment → AI coding tooling](/projects/web/website/setup/environment#ai-coding-tooling)):

```bash
claude plugin install typescript-lsp@claude-plugins-official
/reload-plugins
```

It is the "types on the fly" tier; the commit hook + CI `tsc` remain the enforced gate.

## Config-first · i18n · tokens (repo-convention hooks)

Three small `PostToolUse` hooks enforce conventions the repo documents but eslint can't, each a no-op
except on the file it targets:

- **`config-first.mjs`** — cards the config-first NEVERs eslint misses, on a just-edited **component**:
  raw **color** literals (`#hex` · `rgb()` · `hsl()` · `oklch()` · `bg-[#…]` — use a semantic token per
  [design-token-usage](../../../projects/web/surfaces/website/.claude/rules/design-token-usage.md)) and
  hardcoded **absolute URLs** (read from `@/config`). Advisory; the `config-consistency-reviewer` agent
  does the full pass on demand. Skips config/seo/jsonld/sanity/ui-tokens/shadcn-primitive files (where
  those literals are legitimate).
- **`i18n-parity.mjs`** — on a `messages/<locale>.json` edit, compares every locale in that folder to
  `en` and cards **missing/extra keys**. Only the website had a parity _test_; this covers **every
  surface** (app · mobile) live — a key in one locale but not another renders the raw id at
  runtime.
- **`tokens-fresh.mjs`** — on a `ui-tokens/src/shared/tokens.json` edit, **auto-runs `pnpm tokens:build`**
  so the generated `tokens.css` / hex mirror never drift. The one **auto-fix** hook
  (not just a card); `pnpm tokens:check` in `verify` stays the gate.

## Auto-review triggers (gstack)

Two **advisory** hooks nudge you to run the matching **gstack** review skill at the right
moment — they never block (the repo's blocking gates stay `guard` + `change-hygiene`), and they degrade
gracefully where gstack isn't installed.

- **`review-nudge.sh`** (repo `Stop` hook, wired in committed `settings.json`). On turn end it scans the
  working-tree diff and, when a threshold is crossed, recommends: a large diff → `/review` (+ `/codex`
  at ≥ 200 lines, gstack's own P1-gate threshold); security-sensitive paths (env / CI / `wrangler.toml`
  / infra / deps / SQL) → `/cso`; UI/renderer changes → `/qa`. **gstack-aware** — it names the exact
  slash-commands only when `~/.claude/skills/gstack` exists, else it prints a generic "review the diff"
  nudge, so it is safe in the committed file. Honors `stop_hook_active`; always `exit 0`. It also nudges
  **`pnpm --filter @indiecrafts/mobile-surfaces-main verify`** + an emulator check when
  `code/projects/mobile/**` changed.
- **`plan-review-nudge.sh`** (`PreToolUse` on `ExitPlanMode`, wired in gitignored `settings.local.json`).
  Just before a plan is finalized it suggests a gstack plan review (`/autoplan` for the full CEO + eng +
  design + DX pass, or `/plan-eng-review` for architecture/edge-cases/tests). Personal + gstack-only, so
  its **wiring** lives in `settings.local.json` even though the script is committed (a no-op unless wired
  and gstack is present).

Both are **triggers, not runners** — a hook can only advise; the review skill still runs in the main
thread when you (or the agent) invoke it.

- **`grill-plan.sh`** (`PreToolUse` on `ExitPlanMode`, wired in `settings.local.json`). Fires an
  **imperative** nudge to run **`grill-with-docs`** (doc-grounded; falls back to `grill-me`) and hard-grill
  the plan against a fixed checklist — riskiest assumption · cut scope · edge cases/failure modes ·
  reversibility/blast-radius · a simpler path (ponytail) — **before** it's presented, skipping if the plan
  was already grilled this turn. No-op without the skill. A hook can't run a skill or safely hard-block
  `ExitPlanMode` (a blocking deny would loop), so it nudges — invoke `/grill-plan` any time to force it.

## Security scan (SAST · secrets · deps) — report-first

**`security-scan.sh`** (repo `Stop` hook, wired in committed `settings.json`) is the local Snyk/SonarQube
equivalent. At turn end it scans the working diff and **only advises** (never blocks). Four tiers, each
**guarded** (skipped if the tool is absent):

1. **Sensitive-surface nudge** (no install) — if auth/crypto/route/env/guard files changed, suggests a
   pass with `/cso` (security review) — or, for GDPR-touching diffs, the `compliance-reviewer` subagent.
2. **semgrep** (SAST) — the repo ruleset `.semgrep.yml` (the config-first NEVERs: no secret under a
   public env prefix, no `eval`, no shell-string exec, `dangerouslySetInnerHTML`, `Math.random` tokens).
   `brew install semgrep` (or `pip install semgrep`) to activate; add `--config p/typescript --config
p/secrets` for registry breadth.
3. **gitleaks** (secrets) on the uncommitted changes — `brew install gitleaks` to activate.
4. **`pnpm audit`** (dependency vulns) — runs only when `pnpm-lock.yaml` changed; already available.

Deliberately **report-first** (points you at the command) — the real SAST/Sonar gate belongs in CI, not
on every keystroke. Run the full sweep by hand any time: `semgrep --config .semgrep.yml code/`.

## What else can run on the fly

Any check fast enough for a per-edit hook — eslint, react-doctor, a custom script. Add it as
another entry in the `PostToolUse` `hooks[]` array in `.claude/settings.local.json` (same shape as
the a11y hook). Expensive checks (full `tsc`, axe render, visual diff) belong in the **stop** tier
or a **scan**, not per-edit.

Deeper on-demand audits: the `accessibility-reviewer`, `architecture-reviewer`, `compliance-reviewer`, and `performance-reviewer` subagents.

## Per app (multi-app)

The hook's UI-file filter matches `code/{apps,packages,modules}/<name>/src/**/*.{tsx,jsx}` — a
second app is picked up automatically. It lints against `code/projects/web/surfaces/website`'s eslint config today (the
shared a11y bar). When app #2 ships its **own** rule set, extend the hook to pick the config by the
edited file's app (`code/projects/<name>`).

## Not on the fly (by design)

- **`tsc`** per-edit — too slow; it runs at **commit** and in `pnpm verify`.
- **Full axe / runtime a11y** — needs a rendered page; it lives in E2E (`@axe-core/playwright`).
- **Running the test suite** per-edit — too slow. The **change-hygiene** Stop gate only _reminds_
  you to add/update a test when `code/**` changes without one (it blocks turn-end, with an explicit
  "no test warranted" escape for config/types/generated/presentational-only). `pnpm test`
  (folded into `pnpm verify`) and CI actually **run** them.
