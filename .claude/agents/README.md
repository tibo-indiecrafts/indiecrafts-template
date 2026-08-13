# Agents — vendored into the template

This template is **packaged**: the general agent suite is committed here so a clone works with
no `~/.claude` setup. Claude Code discovers agents recursively, so the topic folders are just
organization.

## Layout

- **Topic folders** (`architecture/ engineering/ testing/ …`) + `agent-coordinator.md` — the
  **vendored general suite** (~79). Source: [`contains-studio/agents`](https://github.com/contains-studio/agents)
  (MIT upstream — add its `LICENSE` here if you redistribute the template publicly).
- **`project/`** — the **template-specific** reviewers that encode *this* repo's conventions
  (not from upstream, don't overwrite): `design-system-reviewer`, `accessibility-reviewer`,
  `ux-reviewer`, `page-builder-reviewer`, `config-consistency-reviewer`.

Per-phase mapping (which agent at which sprint step) →
[`method/shared/process/my-skills-and-agents.md`](../../method/shared/process/my-skills-and-agents.md).

## Off-stack for this Next.js / Sanity template

Kept (so the suite stays whole) but **not used here** — prune if you want a leaner tree:
`core-development/{electron-pro, mobile-developer, websocket-engineer, wordpress-master, graphql-architect, microservices-architect}` ·
`engineering/{mobile-app-builder, ai-engineer}`.

## Keeping them fresh (they can drift)

Vendored copies don't auto-update. Re-pull the general suite from your source-of-truth:

```bash
pnpm agents:sync        # re-copies the topic folders; NEVER touches project/
```

`project/` is hand-maintained and is never overwritten by the sync.
