# Reserved — `packages/hybrid`

**Not built — a reserved scope.** This marks where **hybrid-only** bricks live —
Electron code that a web, mobile, or server runtime can't consume (main-process
modules, Node integration, desktop APIs).

Empty on purpose. A brick lives at the **highest scope it runs on**: cross-platform
→ `packages/shared`, web-client-only → `packages/web`, here **only** when it is
genuinely hybrid-only.

**To activate** — `git mv` (or create) the brick under `code/packages/hybrid/<name>/`
(`package.json` `@indiecrafts/<name>` + `exports`), add a row to
[`_registry.md`](../_registry.md), and wire it into the consuming app. The workspace
glob `code/packages/*/*` already resolves it — no `pnpm-workspace.yaml` edit.

Reserved, not empty — **delete this folder** if the scope is never needed.
