# Reserved — `modules/hybrid`

**Not built — a reserved scope.** This marks where a **hybrid-only feature** lives —
an Electron desktop product slice with no web or mobile surface.

Empty on purpose. A module lives at the **scope where it renders**: web-delivered
→ `modules/web`, cross-platform → `modules/shared`, here **only** when the feature
is genuinely hybrid-only.

**To activate** — `git mv` (or create) the slice under `code/modules/hybrid/<name>/`
and follow the extraction steps in [`.claude/CLAUDE.md`](../.claude/CLAUDE.md) +
[`_registry.md`](../_registry.md). The workspace glob `code/modules/*/*` already
resolves it — no `pnpm-workspace.yaml` edit.

Reserved, not empty — **delete this folder** if the scope is never needed.
