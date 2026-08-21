# @indiecrafts/packages-shared-agent-client — the client caller

Auto-loads under `code/packages/shared/agent-client/**`. The client half of the AI agent: the ONE
typed caller every surface's **front-end** shares to reach an agent endpoint (web route, or the
`code/shared/api` Worker). Pairs with the server half `agent`. Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript, zero-dep — raw `fetch`; edge-safe (Workers runtime, browser, Electron main process).

- **Exports:** `.` — `callAgent(name, request, opts)`, returning `{ ok: true, data } | { ok: false, error }`.
- **Never throws** — missing prefix, empty context, non-200, malformed body, timeout, or network error all become one `{ error }` branch.
- **URL prefix + auth are injected, never read from env** — each app passes its own `urlPrefix` / bearer `token`, so the brick stays portable.
- **One endpoint family (agent), no retries** — generalise the name or add backoff only when a real consumer needs it (YAGNI).

Full reference → [`code/docs/packages/agent-client.md`](../../../../docs/packages/agent-client.md).
