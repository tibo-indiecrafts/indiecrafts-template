# @indiecrafts/utils — pure helpers

Auto-loads under `code/packages/utils/**`. The leaf brick: `cn` · logger · slugify ·
video-embed · format-date. Area rules → `../../.claude/CLAUDE.md`.

**Stack:** TypeScript. Framework-agnostic helpers (cn, logger, parsers).

- **Barrel-less, subpath-only** — like every brick. Import one helper per path
  (`@indiecrafts/utils/cn`, `.../format-date`); explicit-extension `exports` (sanity-style)
  so consumers resolve without a tsconfig `paths` entry. Add a file = add its `exports` line.
- No React/Next runtime here; keep it dependency-light.
- Full reference → [`docs/packages/utils.md`](../../../../docs/packages/utils.md).
