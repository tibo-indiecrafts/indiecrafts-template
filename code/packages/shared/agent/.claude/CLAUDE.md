# @indiecrafts/packages-shared-agent — AI-agent server core

Auto-loads under `code/packages/shared/agent/**`. The shared core for a simple, goal-driven AI
agent: one typed `AgentSpec` (Goal · Instructions · Context · Tools · Output), run against the
Anthropic Messages API. Consumed by every surface's **backend** (the website Next route, the
`code/shared/api` Worker). Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript, zero-dep — raw `fetch` to the Anthropic Messages API; edge-safe (Next route + Cloudflare Worker).

- **Exports:** `.` — `runAgent(spec, input, apiKey)` + the `AgentSpec` type and `SPECS` roster.
- **Never throws** — a bad key / network / parse returns `{ ok: false, error }`; output is forced via a single `output` tool, always JSON.
- **Holds no keys, reads no env** — the calling server injects `ANTHROPIC_API_KEY`; it must never leave a server.
- **Reason-only (v1), human-in-the-loop** — add an agent = one spec + a `SPECS` row (demo: `content-research`).
- **Front-ends never call this** — they go through `agent-client` (`callAgent`).

Full reference → [`code/docs/packages/agent.md`](../../../../docs/packages/agent.md).
