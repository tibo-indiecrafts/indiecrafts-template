# CodeGraph (opt-in agent index)

[CodeGraph](https://github.com/colbymchenry/codegraph) gives an AI coding agent (Claude Code, Cursor, Codex…) a pre-built **semantic index** of this repo — symbols, call sites, imports, inheritance — parsed with tree-sitter into a local SQLite graph. The agent queries the index in one MCP call instead of a grep → read → grep loop, so it spends fewer tokens locating code and more on the actual task.

It is **100% local** (no API keys, no network) and **fully optional** — nothing in the app, build, or CI depends on it. It's a per-developer productivity tool, so it is **not** wired into the committed `.mcp.json` (that would spawn it for every client site). Each developer opts in on their own machine.

---

## Install (once per machine)

```bash
npm i -g @colbymchenry/codegraph   # global binary
codegraph install -y               # registers the MCP server globally (~/.claude.json) for detected agents
codegraph telemetry off            # disable anonymous usage stats (persisted in ~/.codegraph/telemetry.json)
```

`install` writes only to your home (`~/.claude.json`, `~/.cursor`, `~/.codex`) — it does **not** touch this repo. Restart your agent afterward.

> **Telemetry is off by convention here.** The `codegraph:*` npm scripts run with `CODEGRAPH_TELEMETRY=0`, but the agent-spawned watcher/MCP server is launched from your home config and won't inherit that — so run `codegraph telemetry off` once to disable it everywhere (it persists globally).

## Index this repo (once, then automatic)

```bash
pnpm codegraph:init                # → codegraph init — builds .codegraph/codegraph.db
```

- The index lives in `.codegraph/` and is **gitignored** (it's machine-local and regenerated — ~5 MB for this repo, built in ~1.5 s).
- A file-watcher keeps it in sync as you edit; force a full rebuild any time with `pnpm codegraph:init`.
- Claude Code uses it automatically once `.codegraph/` exists — no per-session command.

## Scripts

| Script                  | What it does                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `pnpm codegraph:init`   | Build/rebuild this repo's index (guarded — no-op with a hint if the binary isn't installed) |
| `pnpm codegraph:status` | Show index stats and whether it's up to date                                                |

Both degrade gracefully: if `codegraph` isn't installed, they print a pointer to this page instead of failing.

## Uninstall

```bash
codegraph uninit          # remove .codegraph/ from this repo
codegraph uninstall       # remove the MCP registration from your agents
npm rm -g @colbymchenry/codegraph
```

## Notes

- **Telemetry:** off by convention here (see the setup step above). Re-check any time with `codegraph telemetry status`.
- **Not for CI yet:** `codegraph affected` (run only tests touched by a change) is compelling, but this template has no test runner today — revisit if/when Vitest is added.
- **Trust the tokens, not the index:** CodeGraph reflects the code as last indexed. If a query looks stale, run `pnpm codegraph:init`.
