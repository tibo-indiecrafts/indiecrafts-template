# @indiecrafts/packages-shared-utils — pure helpers

Auto-loads under `code/packages/shared/utils/**`. The leaf brick: `cn` · slugify · video-embed ·
format-date · error-message · filename · share (`shareTargets(url,title)` → X/LinkedIn/Facebook
intent URLs — surface-agnostic, so native can reuse them). Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript. Framework-agnostic helpers (cn, slugify, parsers).

- **Barrel-less, subpath-only** — like every brick. Import one helper per path
  (`@indiecrafts/packages-shared-utils/cn`, `.../format-date`); explicit-extension `exports` (sanity-style)
  so consumers resolve without a tsconfig `paths` entry. Add a file = add its `exports` line.
- No React/Next runtime here; keep it dependency-light.
- Full reference → [`code/docs/packages/utils.md`](../../../../docs/packages/utils.md).
