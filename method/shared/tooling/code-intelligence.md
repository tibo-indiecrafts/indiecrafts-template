# Code intelligence (LSP plugins)

Language-server plugins give an AI coding agent **go-to-definition, find-references, hover
types, and post-edit diagnostics** — so it answers "where is `X` used?" by querying the
language server (exact `file:line` hits) instead of grep → read → grep, and catches type
errors immediately without a full compiler run. Fewer file reads, cleaner context.

They're from **`claude-plugins-official`** (Anthropic's curated marketplace), **100% local**
(they run the open-source language-server binary — the same one your editor uses), with **no
network calls, no telemetry, no exfiltration**. Per-developer, global, **not committed** —
nothing in the app, build, or CI depends on them. Each developer opts in on their machine.

Pairs with `permissions.deny` rules: deny rules block noise, code intelligence reduces the
need to scan what remains.

---

## TypeScript / JavaScript / React — this repo's stack

```bash
npm i -g typescript-language-server typescript        # the binary (the plugin does NOT auto-install it)
claude plugin install typescript-lsp@claude-plugins-official
# run /reload-plugins if the install summary says so
```

Covers `.ts` · `.tsx` · `.js` · `.jsx` · `.mts` · `.cts` · `.mjs` · `.cjs` — **plain
JavaScript and React JSX included** (tsserver handles both). Non-JS/TS files (`.css`, `.md`,
`.json`) are simply **inert** — no help, no harm.

**Monorepo note.** tsserver reads the same `tsconfig.json` as `tsc`, and `pnpm tsc` is green
here, so import resolution is clean: the shared bricks resolve via pnpm's
`node_modules/@indiecrafts/*` symlinks + `exports`, and `@indiecrafts/blog` +
`@indiecrafts/ui-components` via the app's tsconfig `paths`. If false "unresolved import"
noise ever appears for an internal brick, add a `paths` entry for it.

## Other languages — one plugin per language

`typescript-lsp` does **nothing** for non-JS/TS languages. `claude-plugins-official` ships a
separate LSP plugin per language — install the matching one **and** its server binary. There
is **no generic multi-language bridge**; stack them for a polyglot repo.

| Language | Plugin | Server binary |
| --- | --- | --- |
| Python | `pyright-lsp` | `pyright-langserver` |
| Go | `gopls-lsp` | `gopls` |
| Rust | `rust-analyzer-lsp` | `rust-analyzer` |
| C / C++ | `clangd-lsp` | `clangd` |
| C#, Java, Kotlin, Lua, PHP, Swift | one plugin each | its language server |

## Safety

Official Anthropic-curated marketplace; plugins pass automated validation. The plugin
executes **only** the open-source language-server binary, with your user privileges, on the
repo on disk — no network, no telemetry. Safe on proprietary code. Install only from
marketplaces you trust.
