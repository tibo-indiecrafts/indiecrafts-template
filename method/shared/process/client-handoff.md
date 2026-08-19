# Client handoff — what you give, what stays yours

This template does double duty: **your own platform dev** (everything, together) and **client
projects** (a clean subset). Keep the two separate at handoff so your method, toolchain, business,
and other clients never leak.

## The boundary

| Layer                                                                                                                | Travels on `git clone`?                                                                         | Give a client?                                                              |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `code/` (app · packages · modules · db · infra)                                                                      | ✅ tracked                                                                                      | ✅ **the deliverable** (rebrand `@indiecrafts/*` if wanted)                 |
| `docs/` (setup · config · design · seo · modules · packages)                                                         | ✅ tracked                                                                                      | ✅ deliverable (toolchain pages already removed)                            |
| `method/` (framework · rules · workflows · engineering · templates · context · **PRODUCT · roadmap · tooling docs**) | ⚠️ **yes — tracked** (`export-ignore`d: omitted from `git archive`, but present in a raw clone) | ❌ **never** — your IP                                                      |
| `work/` (sprints · MEMORY · backlog · business · other clients)                                                      | ⚠️ **yes — tracked** (`export-ignore`d, **not** clone-safe)                                     | ❌ **never**                                                                |
| root `.claude/` (agents · skills · settings · rules)                                                                 | ✅ tracked                                                                                      | ⚠️ your toolchain — **strip on handoff**                                    |
| `.claude/hooks/*` + `.claude/settings.local.json` (the on-the-fly hooks — scripts **and** wiring)                    | ❌ **gitignored**                                                                               | ❌ never — local-by-design, so studio gates never run on a client's machine |

**Default handoff = `code/` + `docs/`. More on demand.** `method/` and `work/` are **tracked, only
`export-ignore`d** — a **`git archive` export** (the clean hand-off) omits them, but a **raw `git clone`
DOES carry them**. So hand off by `git archive` / the allowlist, **never a clone**. The root `.claude/`
toolchain (agents/skills/settings) travels on both and shouldn't reach a client either — exclude those
folders when you hand over.

## How the code stays self-contained

- **`.claude/rules/` are inlined** (no `@import` into `method/`, which the `git archive` export omits) —
  they load even when the delivered subset has no `method/`. The richer teaching prose lives privately in
  `method/apps/web/rules/`.
- **`PRODUCT.md` + the page-builder roadmap** moved to `method/apps/web/` (private). Author a
  fresh per-client `PRODUCT.md` at project start if you want one.
- **Private-repo names/paths** (the component library) are neutralized to `<your-component-library>`.
- **Toolchain docs** (CodeGraph · LSP · Headroom · caveman/ponytail · the CLAUDE.md-system page)
  live in `method/shared/tooling/` (private method site :3003), not the client docs (:3002).

## Handoff checklist

1. Confirm `git grep -lE "gstack|codegraph|ponytail|caveman|indiecrafts-library" -- docs` is empty.
2. Give the client `code/` + `docs/` (a fresh repo, or a branch with root `.claude/` + `method/`
   - `work/` removed). `pnpm build` must be green with `method/` absent.
3. Rebrand `@indiecrafts/*` to the client's scope only if they'll maintain the code long-term.
4. Their content + secrets live in **their** Sanity project + **their** env store — never yours.
