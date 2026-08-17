# Project memory

Long-term context and decisions for this template — the "why" that outlives any
single change. Committed and team-shared.

**This file is a pointer, not a duplicate.** The template already records durable
information in dedicated places; MEMORY.md just indexes them so an agent (or a new
teammate) has one entry point:

| What                                              | Where it lives                              |
| ------------------------------------------------- | ------------------------------------------- |
| How to code — architecture, conventions, workflow | `CLAUDE.md` (+ scoped `src/**/CLAUDE.md`)   |
| How to design — visual token contract             | `code/packages/tokens/DESIGN.md`                   |
| Focused conventions, loaded on demand             | `method/apps/web/rules/*`                           |
| What changed and _why_ (code + design)            | `code/apps/web/CHANGELOG.md` (app; root roll-up in `/CHANGELOG.md`) |
| Design rationale, per-topic deep dives            | `docs/apps/web/design/*`, `docs/apps/web/design/decisions.md` |
| Human-facing docs (VitePress)                     | `docs/`                                     |

## Durable decisions (add as they're made)

- **OKLCH is the single source of truth for color** (`globals.css`); the hex in
  `DESIGN.md` / `theme.hexColors` are sRGB mirrors for tooling only. Never fork a
  parallel token file. See [[design-token-usage]] (`method/apps/web/rules/`).
- **The template ships to client sites.** Personal/global tooling stays out of the
  repo; only team-shared config is committed. See `CLAUDE.local.md` (local) vs
  `CLAUDE.md` (committed).

<!-- Append new project-level decisions here with a one-line why. Keep it terse;
     detailed rationale goes in CHANGELOG.md or docs/apps/web/design/decisions.md. -->
