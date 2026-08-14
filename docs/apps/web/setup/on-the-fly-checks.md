# On-the-fly quality checks

Feedback fires in **tiers**, fastest first: cards as code is written, a hard gate at commit,
deep scans on demand. Nothing here is a manual scan you have to remember to run.

## The tiers

| Tier | Fires | Runs | Blocks? |
| --- | --- | --- | --- |
| **edit** | after every `Edit` / `Write` / `MultiEdit` (Claude Code `PostToolUse` hook) | design cards (impeccable) + **a11y cards** (`jsx-a11y`) on the just-edited UI file | no — cards |
| **stop** | at turn end (`Stop` hook) | design deep pass + **a11y deep pass** (whole changed UI set) + docs-drift | docs-drift blocks; a11y/design advise |
| **commit** | `git commit` (husky) | `lint-staged` (eslint `jsx-a11y` + prettier on staged) then `tsc` | **yes — hard gate** |
| **scan** | on demand | `pnpm verify` (tsc · lint · contrast · react-doctor · test) · `pnpm shadscan` · axe E2E | manual |

The edit + stop tiers are **cards** — fast, advisory, no block. Correctness is still enforced at
**commit** and in CI. The point is to see a problem the second you write it, not at commit.

## Accessibility on the fly

`.claude/hooks/a11y-check.mjs` (a repo-owned `PostToolUse` + `Stop` hook) surfaces structural
accessibility findings as cards:

- **Exact rules, no drift** — it feeds each file to the app's real eslint via `--stdin` with an
  in-base-path `--stdin-filename`, so the `jsx-a11y` rule set in
  [`code/apps/web/eslint.config.mjs`](../../../../code/apps/web/eslint.config.mjs) applies
  verbatim (alt text · labels · roles · aria · keyboard).
- **Covers files anywhere** — app, packages, and modules. The `--stdin` trick sidesteps
  `eslint-config-next`'s "outside base path" skip, so UI moved into `@indiecrafts/ui/web`,
  `ui-components/web`, etc. is checked too.
- **Edit tier** lints the one edited file; **Stop tier** re-lints the whole changed UI set once.
- **Non-blocking** — the **commit** hook (`jsx-a11y` in `lint-staged`) is the hard gate; CI's
  `pnpm verify:contrast` + axe E2E cover the runtime/color side.

Its design twin is the **impeccable** hook (spacing · color · hierarchy). One judges look, the
other judges structural a11y.

## What else can run on the fly

Any check fast enough for a per-edit hook — eslint, react-doctor, a custom script. Add it as
another entry in the `PostToolUse` `hooks[]` array in `.claude/settings.local.json` (same shape as
the a11y hook). Expensive checks (full `tsc`, axe render, visual diff) belong in the **stop** tier
or a **scan**, not per-edit.

Deeper on-demand audits: the `accessibility-reviewer` / `accessibility-tester` subagents.

## Per app (multi-app)

The hook's UI-file filter matches `code/{apps,packages,modules}/<name>/src/**/*.{tsx,jsx}` — a
second app is picked up automatically. It lints against `code/apps/web`'s eslint config today (the
shared a11y bar). When app #2 ships its **own** rule set, extend the hook to pick the config by the
edited file's app (`code/apps/<name>`).

## Not on the fly (by design)

- **`tsc`** per-edit — too slow; it runs at **commit** and in `pnpm verify`.
- **Full axe / runtime a11y** — needs a rendered page; it lives in E2E (`@axe-core/playwright`).
