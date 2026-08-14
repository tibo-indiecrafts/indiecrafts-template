# Agents — vendored into the template

This template is **packaged**: the general agent suite is committed here so a clone works with
no `~/.claude` setup. Claude Code discovers agents recursively, so the topic folders are just
organization.

## Layout

- **Topic folders** (`architecture/ testing/ deployment/ …`) — the vendored general agents
  **referenced by a method step** (~63 — a phase batch, the Growth/GTM lane, a stack-option, or a
  use-case-tagged Optional in `bench-map.md` § A). Source:
  [`contains-studio/agents`](https://github.com/contains-studio/agents)
  (MIT upstream — add its `LICENSE` here if you redistribute the template publicly).
- **`bench/<topic>/`** + `bench/agent-coordinator.md` — **only the `bench-map.md` § D "Skip"** agents
  (~16): redundant with a wired agent, or off-stack for this Next.js/Sanity template. Still
  discovered + invokable, just parked.
- **`project/`** — the **template-specific** reviewers that encode *this* repo's conventions
  (not from upstream, don't overwrite): `design-system-reviewer`, `accessibility-reviewer`,
  `ux-reviewer`, `copy-reviewer`, `page-builder-reviewer`, `config-consistency-reviewer`.

**Two lanes.** Most wired agents serve the **feature lane** (the 7-phase build sprint). The
**`marketing/`** folder is the **project lane's growth/GTM lane** (`growth-hacker` + channel agents),
fired per product at the go-to-market stages — plus `project-shipper` / `uat-coordinator`
(`deployment/`, `project-management/`) at launch and `experiment-tracker` at grow.

Per-phase mapping (which agent at which sprint step) + the per-project-stage mapping →
[`method/shared/process/my-skills-and-agents.md`](../../method/shared/process/my-skills-and-agents.md)
(the project lane is [`launch-playbook.md`](../../method/shared/process/launch-playbook.md)).

## The bench (`bench/`)

Only the **`bench-map.md` § D "Skip"** agents live under `bench/<topic>/` — **off-stack** for this
Next.js / Sanity template (`electron-pro` · `wordpress-master` · `microservices-architect` ·
`ai-engineer` · `chaos-engineer` · `mobile-app-builder` · `app-store-optimizer`), **redundant** with
a wired agent (`architecture-consultant` ≡ system-architect · `performance-optimizer` ≡
performance-benchmarker · `tech-writer` ≡ documentation-engineer · `git-workflow-manager` ≡
git-manager · `content-creator` ≡ the marketing skill · `project-template-manager` · `agent-coordinator`),
or **team/org** orchestration a solo workflow doesn't need (`studio-producer` · `training-change-manager`).
**Kept whole, not pruned** — invoke any by name. Everything a method step *names* — phase batches,
the Growth/GTM lane, surface-gated stack-options, and the Optional use-case set — lives in a topic
folder, not here.

## Keeping them fresh (they can drift)

Vendored copies don't auto-update. Re-pull the general suite from your source-of-truth:

```bash
pnpm agents:sync                           # re-vendor topic folders + re-split wired/bench; NEVER touches project/
bash scripts/sync-agents.sh --split-only   # re-split the current tree without re-pulling
bash scripts/sync-agents.sh --dry-run      # print the split, move nothing
```

`project/` is hand-maintained and never overwritten. The **wired list** lives in
`scripts/sync-agents.sh` — keep it in step with the registry (`my-skills-and-agents.md`) when
you wire or unwire an agent, or a newly-wired agent stays benched.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Netlify/Vercel dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
