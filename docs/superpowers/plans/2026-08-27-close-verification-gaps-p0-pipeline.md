# P0 — Pipeline Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the CI/deploy pipeline gate what ships — close the three critical pipeline holes from the audit.

**Architecture:** Three isolated GitHub Actions config changes. Fold the four missing tooling gates into the CI `verify` job; run the secret gates on push, not only PRs; make the prod deploy wait for CI to pass via a `workflow_run` trigger. No application code changes.

**Tech Stack:** GitHub Actions (YAML), pnpm 10, Node 22, existing repo check scripts.

**Spec:** `docs/superpowers/specs/2026-08-27-close-verification-gaps-design.md` (Phase 0).

## Global Constraints

- Node 22, pnpm 10. Workspace root is the repo root.
- The CI workflow `name:` is `CI` (`.github/workflows/test.yml`). The deploy workflow is `Deploy (Cloudflare)` (`.github/workflows/deploy.yml`). Reference `CI` by that exact name in `workflow_run`.
- Do not change the semantics of existing CI jobs; only add steps / adjust triggers.
- Agent-authored text (commits, docs) follows `.claude/rules/writing-style.md`: active voice, one idea per sentence, exact technical items.
- Commit messages end with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- `.github/**` is outside `code/**`, so the change-hygiene Stop hook does not require a colocated test for these files. YAML is verified by parsing + reasoning, not a unit test.
- Work in the worktree: `/Users/home/Code/indiecrafts-verify-gaps` (branch `feat/close-verification-gaps`).

---

### Task 1: Fold the four missing gates into CI `verify`

Add `check:api-guards`, `tokens:check`, `brands:check`, `check:tasks` to the CI `verify` job. These already pass locally; CI just was not running them, so a new violation could merge. Confirm they pass on the current tree first, so this task adds green checks, never a new red.

**Files:**
- Modify: `.github/workflows/test.yml` (the `verify` job, after the `pnpm test` step at line 40)

**Interfaces:**
- Consumes: existing root scripts `check:api-guards`, `tokens:check`, `brands:check`, `check:tasks` (all defined in root `package.json`).
- Produces: nothing downstream; a self-contained CI change.

- [ ] **Step 1: Confirm each gate passes on the current tree**

Run from the worktree root:
```bash
pnpm check:api-guards && pnpm tokens:check && pnpm brands:check && pnpm check:tasks
```
Expected: every command exits 0. If any fails, STOP — that is a pre-existing violation to fix or report before wiring it into CI (do not mask it).

- [ ] **Step 2: Add the four steps to the `verify` job**

In `.github/workflows/test.yml`, the `verify` job currently ends:
```yaml
      - run: pnpm test:scripts
      - run: pnpm test
```
Append after the `pnpm test` line (same indentation, still inside `verify.steps`):
```yaml
      - run: pnpm check:api-guards
      - run: pnpm tokens:check
      - run: pnpm brands:check
      - run: pnpm check:tasks
```

- [ ] **Step 3: Verify the workflow YAML still parses**

Run:
```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/test.yml')); print('ok')"
```
Expected: prints `ok`. If it raises, fix the indentation (the new steps must sit under `jobs.verify.steps` at the same depth as the sibling `- run:` lines).

- [ ] **Step 4: Confirm the added steps are inside the `verify` job**

Run:
```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/test.yml')); runs=[s.get('run') for s in d['jobs']['verify']['steps']]; assert 'pnpm check:api-guards' in runs and 'pnpm check:tasks' in runs, runs; print('verify job runs:', [r for r in runs if r])"
```
Expected: the printed list includes all four new commands.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "ci: run api-guards, tokens, brands, tasks checks in verify

These four tooling gates ran only in local \`pnpm verify\`, which the docs
call rarely-needed. A new unguarded route or stale generated file could
merge. Fold them into the CI verify job so CI enforces them.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Run the secret gates on push, not only on PRs

`secrets-scan` (gitleaks) and `dependency-review` are PR-only. A direct push to `main` skips both — and that same push triggers the deploy. Make gitleaks run on push. Attempt `dependency-review` on push with explicit refs; fall back to PR-only if the action rejects the push event.

**Files:**
- Modify: `.github/workflows/test.yml` (the `dependency-review` job, line 134-139; the `secrets-scan` job, line 175-184)

**Interfaces:**
- Consumes: `actions/dependency-review-action@v4`, `gitleaks/gitleaks-action@v2` (already referenced).
- Produces: nothing downstream.

- [ ] **Step 1: Make `secrets-scan` run on push and PR**

Change the `secrets-scan` job's guard from:
```yaml
  secrets-scan:
    if: github.event_name == 'pull_request'
```
to:
```yaml
  secrets-scan:
    if: github.event_name == 'pull_request' || github.event_name == 'push'
```
The existing `fetch-depth: 0` checkout already gives gitleaks the full history it needs on push.

- [ ] **Step 2: Make `dependency-review` run on push, with push refs**

Change the `dependency-review` job from:
```yaml
  dependency-review:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/dependency-review-action@v4
```
to:
```yaml
  dependency-review:
    if: github.event_name == 'pull_request' || github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/dependency-review-action@v4
        with:
          # On PRs the action derives base/head itself; on push it needs them.
          base-ref: ${{ github.event.pull_request.base.sha || github.event.before }}
          head-ref: ${{ github.event.pull_request.head.sha || github.sha }}
```

- [ ] **Step 3: Verify the YAML parses and the guards changed**

Run:
```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/test.yml')); print('secrets-scan if:', d['jobs']['secrets-scan']['if']); print('dependency-review if:', d['jobs']['dependency-review']['if'])"
```
Expected: both `if:` values include `|| github.event_name == 'push'`.

- [ ] **Step 4: Record the fallback**

If, after this lands and CI runs on `main`, the `dependency-review` job errors on the push event (the action historically targets PRs), revert ONLY the `dependency-review` change to `if: github.event_name == 'pull_request'` and leave a one-line comment: `# dependency-review is PR-only; push coverage is the gitleaks scan + the CI-gated deploy`. Gitleaks-on-push plus the Task 3 deploy gate still close the security exposure. Note this outcome in the close-out (Task 4).

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/test.yml
git commit -m "ci: run gitleaks + dependency-review on push, not only PRs

A direct push to main skipped both gates and still triggered the deploy.
Run them on push too. dependency-review gets explicit push refs; if the
action rejects the push event, it falls back to PR-only (see plan Task 2).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Gate the prod deploy on CI

Make the prod deploy wait for the `CI` workflow to succeed on `main`. Replace the `push` trigger with a `workflow_run` trigger; keep `workflow_dispatch` as the manual escape hatch. Add the branch-protection steps to the deployment doc as the second, belt-and-suspenders layer.

**Files:**
- Modify: `.github/workflows/deploy.yml` (the `on:` block, lines 5-14; the `discover` job, lines 24-31)
- Modify: `code/docs/apps/web/setup/deployment.md` (the "GitHub Actions (auto-deploy)" section)

**Interfaces:**
- Consumes: the `CI` workflow name from `.github/workflows/test.yml`.
- Produces: nothing downstream.

- [ ] **Step 1: Replace the `push` trigger with `workflow_run`**

In `.github/workflows/deploy.yml`, change the `on:` block from:
```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: Target environment
        type: choice
        options: [dev, staging, prod]
        default: prod
```
to:
```yaml
on:
  # Prod deploy fires only after CI succeeds on main (see the success gate on
  # the discover job). Manual dispatch stays available for dev/staging/prod.
  workflow_run:
    workflows: ["CI"]
    types: [completed]
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: Target environment
        type: choice
        options: [dev, staging, prod]
        default: prod
```

- [ ] **Step 2: Gate the `discover` job on CI success**

The `deploy` job already `needs: discover`, so gating `discover` cascades. Add an `if:` to the `discover` job:
```yaml
  discover:
    # workflow_dispatch runs unconditionally; a workflow_run only deploys when CI passed.
    if: ${{ github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    outputs:
      apps: ${{ steps.registry.outputs.apps }}
```

- [ ] **Step 3: Reason through the trigger logic**

Confirm by inspection, and write nothing yet:
- A push to `main` → CI runs → on success, `workflow_run` fires deploy → `discover.if` is true → deploys `prod`.
- CI fails on `main` → `workflow_run` still fires (`types: [completed]`) → `discover.if` is false (`conclusion != 'success'`) → deploy is skipped.
- Manual `workflow_dispatch` → `discover.if` true via the first clause → deploys the chosen env.
- `github.event.inputs.environment` is undefined on `workflow_run`, so `github.event.inputs.environment || 'prod'` (unchanged in the `deploy` job + `concurrency`) resolves to `prod`.

- [ ] **Step 4: Verify the deploy YAML parses and the gate is present**

Run:
```bash
python3 -c "import yaml; d=yaml.safe_load(open('.github/workflows/deploy.yml')); print('triggers:', list(d[True].keys())); print('discover.if:', d['jobs']['discover'].get('if'))"
```
(Note: PyYAML parses the `on:` key as boolean `True`.) Expected: triggers list contains `workflow_run` and `workflow_dispatch`; `discover.if` shows the success gate.

- [ ] **Step 5: Add the branch-protection layer to the deploy doc**

In `code/docs/apps/web/setup/deployment.md`, under "GitHub Actions (auto-deploy)", add:
```markdown
> **Deploy is gated on CI.** `deploy.yml` triggers on `workflow_run` after the
> `CI` workflow succeeds on `main` — a red CI blocks the prod deploy. As a second
> layer, make CI a **required status check**: repo **Settings → Branches → add a
> branch protection rule** for `main` → enable **Require status checks to pass
> before merging** → select the `CI` checks (`verify`, `build`, `browser-stories`,
> `csp`, `docs`, `infra`, `wrangler`). This blocks a merge, while `workflow_run`
> blocks the deploy — together nothing ships on a red CI.
```

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy.yml code/docs/apps/web/setup/deployment.md
git commit -m "ci: gate the prod deploy on CI success (workflow_run)

deploy.yml and test.yml both fired on push to main independently, so a red
CI did not stop the deploy. Trigger deploy on workflow_run after CI, gated
on conclusion == success; keep workflow_dispatch as the manual path. Add the
branch-protection required-check steps to the deployment doc as a second layer.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Close out P0

Reflect P0 completion in the tracking surfaces. Orchestrator-run (not a code change).

**Files:**
- Modify: the review artifact (via the Artifact tool — orchestrator only)
- Modify: root `CHANGELOG.md` (a `### Changed` entry for the pipeline gates)

- [ ] **Step 1: Log the change**

Add a `### Changed` bullet group to root `CHANGELOG.md`:
```markdown
### Changed

- CI now enforces `api-guards`, `tokens`, `brands`, and `tasks` checks (were local-only).
- Secret scanning (gitleaks) runs on push to `main`, not only on PRs.
- The prod deploy is gated on CI success via `workflow_run`; a red CI blocks the ship.
```

- [ ] **Step 2: Commit the changelog**

```bash
git add CHANGELOG.md
git commit -m "docs(changelog): P0 pipeline-integrity gates

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 3: Tag the P0 gaps DONE in the review artifact**

Orchestrator updates the "Green to Ship" artifact (same URL) — mark pipeline gaps #1, #2, #3 (and #4 tokens/brands, #5 tasks) as `DONE` with the commit shas. Republish to the same path.

---

## Self-Review

**Spec coverage (Phase 0):**
- Spec 0.1 (gate deploy on CI + branch-protection doc) → Task 3. ✓
- Spec 0.2 (secret gates on push) → Task 2. ✓
- Spec 0.3 (fold checks into CI verify) → Task 1. ✓
- Artifact + changelog close-out → Task 4. ✓

**Placeholder scan:** No TBD/TODO. Every step has the exact YAML or command. The Task 2 fallback is a concrete, conditional instruction, not a placeholder.

**Type consistency:** No shared code symbols; the cross-references are the workflow name `CI` (Task 3 → test.yml) and the four root scripts (Task 1), all named exactly.

## Execution Handoff

P0 is 3 config tasks + a close-out. These are small, sequential, and low-risk — inline execution with a checkpoint after each commit fits better than a subagent-per-task fan-out for pure YAML edits.
