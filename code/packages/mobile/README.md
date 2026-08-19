# Reserved — `packages/mobile`

**Not built — a reserved scope.** This marks where **mobile-only** bricks live —
Expo / React-Native code that a web or server runtime can't consume (native
modules, RN components, platform APIs).

Empty on purpose. A brick lives at the **highest scope it runs on**: cross-platform
→ `packages/shared`, web-client-only → `packages/web`, here **only** when it is
genuinely mobile-only.

**To activate** — `git mv` (or create) the brick under `code/packages/mobile/<name>/`
(`package.json` `@indiecrafts/<name>` + `exports`), add a row to
[`_registry.md`](../_registry.md), and wire it into the consuming app. The workspace
glob `code/packages/*/*` already resolves it — no `pnpm-workspace.yaml` edit.

Reserved, not empty — **delete this folder** if the scope is never needed.
