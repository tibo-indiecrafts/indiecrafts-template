# Reserved — `modules/shared`

**Not built — a reserved scope.** This marks where a **cross-platform feature**
lives — a module whose UI + engine run on more than one platform (web + mobile),
not just one.

Empty on purpose. A module lives at the **scope where it renders**: web-delivered
→ `modules/web`, here **only** when the same feature ships on ≥2 platforms.

**To activate** — `git mv` (or create) the slice under `code/modules/shared/<name>/`
and follow the extraction steps in [`.claude/CLAUDE.md`](../.claude/CLAUDE.md) +
[`_registry.md`](../_registry.md). The workspace glob `code/modules/*/*` already
resolves it — no `pnpm-workspace.yaml` edit.

Reserved, not empty — **delete this folder** if the scope is never needed.
