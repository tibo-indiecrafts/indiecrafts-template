# Agents — vendored into the template

This template is **packaged**: the general agent suite is committed here so a clone works with
no `~/.claude` setup. Claude Code discovers agents recursively, so the topic folders are just
organization.

## Layout

- **Topic folders** (`architecture/ testing/ deployment/ …`) — the vendored general agents, **all kept
  - categorised** (no bench). `agent-coordinator.md` sits at the agents root. Source:
    [`contains-studio/agents`](https://github.com/contains-studio/agents)
    (MIT upstream — add its `LICENSE` here if you redistribute the template publicly).
- **`project/`** — the **template-specific** reviewers that encode _this_ repo's conventions
  (not from upstream, don't overwrite): `design-system-reviewer`, `accessibility-reviewer`,
  `ux-reviewer`, `copy-reviewer`, `page-builder-reviewer`, `config-consistency-reviewer`.

**Two lanes.** Most wired agents serve the **feature lane** (the 7-phase build sprint). The **growth /
content agents moved to the studio content vault** (`~/Code/indie-brain/.claude/agents/`) — this code
framework is dev-only. The project lane's **launch orchestration** stays here: `project-shipper` /
`uat-coordinator` (`deployment/`, `project-management/`) at launch and `experiment-tracker` at grow.

## Situational agents (kept, categorised — reach for them when the use-case fits)

No bench: every agent lives in its topic folder and is invokable by name. Some aren't on the default hot
path — reach for them when the project calls for it:

- `electron-pro` — the **`hybrid` (electron)** app slot · `mobile-app-builder` — the **`mobile` (expo)** app slot.
- `ai-engineer` — when a feature is genuinely AI-heavy · `wordpress-master` / `microservices-architect` /
  `chaos-engineer` — off-stack unless the project adds that surface.
- `architecture-consultant` · `performance-optimizer` · `tech-writer` · `git-workflow-manager` — each
  overlaps a default agent (`system-architect` · `performance-benchmarker` · `documentation-engineer` ·
  `git-manager`); reach for the default first.
- `studio-producer` · `training-change-manager` — team/org orchestration (a solo flow rarely needs them).

## Keeping them fresh (they can drift)

Vendored copies don't auto-update. Re-pull the general suite from your source-of-truth:

```bash
pnpm agents:sync                       # re-vendor topic folders + agent-coordinator; NEVER touches project/
bash scripts/sync-agents.sh --dry-run  # print what would re-vendor, copy nothing
```

`project/` is hand-maintained and never overwritten. There is **no wired/bench split** — every vendored
agent lands in its topic folder, mirroring the source.

## Links

- **Live:** `<production URL>` · **Repo:** `<git URL>` · **Deploy:** `<Netlify/Vercel dashboard>`

<!-- Template placeholders — fill per project; canonical URLs live in the root README. -->
