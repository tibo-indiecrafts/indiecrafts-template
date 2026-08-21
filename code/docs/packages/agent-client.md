# AI agent client (`@indiecrafts/packages-shared-agent-client`)

The **client half** of the AI agent. [`@indiecrafts/packages-shared-agent`](/packages/agent) is the
server half (it runs the model); this is the ONE typed caller every surface's front-end shares to reach
an agent endpoint. Pure, edge-safe TS (zero deps, raw `fetch`). Lives in `code/packages/shared/agent-client`.

## Why it exists

Three callers hand-rolled the same `fetch` + parse + never-throw contract:

- the web client `ContentResearchAgent` → its own Next route `POST /api/agent/:name`,
- the mobile `lib/agent.ts` → the `code/shared/api` Worker `POST /v1/agent/:name`,
- the hybrid main process → the same Worker.

They drifted (different Result shapes, no timeout). This brick is the single copy — one place for the
fetch, the timeout, and the `{ ok } | { error }` contract.

## Surface

```ts
export async function callAgent<T = unknown>(
  name: string,
  request: { context: string; locale?: string },
  opts: {
    urlPrefix: string;                       // `${base}/v1/agent` (Worker) | `/api/agent` (web route)
    token?: string;                          // bearer — the Worker's APP_API_TOKEN gate; omit for the web route
    extraBody?: Record<string, unknown>;     // merged into the POST — e.g. { "cf-turnstile-response": t }
    fetch?: typeof fetch;                    // injected (default: global fetch)
    timeoutMs?: number;                      // default 30000
  },
): Promise<{ ok: true; data: T } | { ok: false; error: string }>;
```

- **Never throws** — a missing prefix, empty context, non-200, malformed body, timeout, or network
  error all return `{ ok: false, error }`, so a caller renders one failure branch.
- **URL prefix + auth are injected, never read from env** — the brick stays portable (each app injects
  its own env), so it runs on the Workers runtime, in a browser, and in the Electron main process.
- **Posts** `{ context, locale, ...extraBody }` and parses the `{ data }` envelope the agent core
  returns; a 200 with no `data` key is treated as malformed.

## Who calls it — per-surface injection

| Surface | urlPrefix | Auth |
| --- | --- | --- |
| **Web** (`ContentResearchAgent`) | `/api/agent` (same-origin) | none — a Turnstile token in `extraBody`; the Next route's `withGuard` verifies it |
| **Mobile** (Expo, `lib/agent.ts`) | `${EXPO_PUBLIC_API_URL}/v1/agent` | bearer `EXPO_PUBLIC_AGENT_TOKEN` |
| **Hybrid** (Electron main process) | `${API_URL}/v1/agent` | bearer `AGENT_TOKEN` (stays out of the renderer) |

## Wiring

Pure-logic brick — the two always-on wires only: a `transpilePackages` entry (web) + a `workspace:*`
dep on each of the three surfaces. No wildcard export, so no `tsconfig` `paths`; no Tailwind, no Sanity.

## Not yet

- **One endpoint family (agent).** Named `agent-client`, not `api-client` — generalise the name only
  when a second endpoint family appears (YAGNI).
- **No retries.** The timeout is here; a retry/backoff policy is the next thing that would live in this
  brick if a caller needs it.
- **No per-spec response validation.** The `{ data }` envelope is checked structurally; the shape of
  `data` is the agent spec's `outputSchema`, validated server-side by the core.
