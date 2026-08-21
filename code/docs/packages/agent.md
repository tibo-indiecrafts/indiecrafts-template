# AI agent (`@indiecrafts/packages-shared-agent`)

The **shared core for a simple, goal-driven AI agent** — one definition, consumed by every surface. Pure,
edge-safe TS (zero deps, raw `fetch` to the Anthropic Messages API). The core is hosted by **one dedicated
Cloudflare Worker**, [`code/shared/agent`](/apps/workers/) — every surface calls it. The core brick lives
in `code/packages/shared/agent`; its deploy shell + request guard live in `code/shared/agent`.

## The formula

An agent is the 5-part formula as one typed `AgentSpec` (Goal · Instructions · Context · Tools · Output):

```ts
export type AgentSpec = {
  name: string;
  model: string;               // default "claude-haiku-4-5-20251001"
  goal: string;                // Goal
  instructions: string;        // Instructions (incl. how to handle uncertainty)
  context?: string;            // static Context (per-request context is appended)
  outputSchema: OutputSchema;  // Output — a JSON Schema, FORCED via a single "output" tool
};
export async function runAgent(
  spec: AgentSpec, input: { context: string; locale?: string }, apiKey: string,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }>;
```

- **Structured output** — a single forced `output` tool (`tool_choice`) so Claude always returns JSON in
  `outputSchema`, no prose to parse.
- **Locale-aware** — `input.locale` (the app's active locale) makes the model write every output value in
  the visitor's language.
- **Never throws** — a bad key / network / parse returns `{ ok: false, error }`.
- **Key is caller-injected** — the brick holds no keys and reads no env; the calling server passes its
  `ANTHROPIC_API_KEY`.
- **Reason-only (v1)** — no tools beyond the output shape; **human-in-the-loop** (the result is a draft to
  review, not an action). Add a spec + a `SPECS` row for a new agent; the demo is `content-research`.

## Who calls it — one Worker, one dual-mode guard

Every surface calls the **agent Worker** `POST /v1/agent/:name`. The Worker branches on the `Origin` header
(a native caller sends none), so one endpoint serves both:

| Surface | How it calls | Guard |
| --- | --- | --- |
| **Web** (website · admin) | cross-origin `fetch` to the agent Worker (`NEXT_PUBLIC_AGENT_URL`) | allowlisted `Origin` → **Turnstile** token (body `cf-turnstile-response`) + CORS + Cloudflare native rate-limit + body cap |
| **Native** (Expo) · **Hybrid** (Electron) | the agent Worker origin (`EXPO_PUBLIC_AGENT_URL` / `AGENT_URL`) | no `Origin` → **app bearer token** + native rate-limit + body cap. Electron calls from the **main process** so the token stays out of the renderer. |

**`ANTHROPIC_API_KEY` never leaves the agent Worker** — it is absent from every app bundle and from the
website + api. The web **Turnstile secret** also lives only on the Worker (the site ships the public widget
key). The mobile/hybrid **bearer token is a bundle value**, so it's an abuse *gate*, not per-user auth; real
accounts are the reserved `auth` package.

## Wiring

- Agent Worker (`code/shared/agent`): a `workspace:*` dep on the core brick; `ANTHROPIC_API_KEY` +
  `APP_API_TOKEN` + `TURNSTILE_SECRET` via `wrangler secret put` (+ `.dev.vars`); the `AGENT_RATELIMIT`
  binding. A row in `scripts/lib/apps.mjs` (slug `agent`) — CI + `deploy:all` fan out automatically.
- Web: the browser posts to `NEXT_PUBLIC_AGENT_URL` from `ContentResearchAgent` (strings in
  `messages/<locale>.json`); the Worker origin is in the CSP `connect-src` (`getCSPConnectSources`); the
  site keeps only the public `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- Apps: mobile `lib/agent.ts` (`EXPO_PUBLIC_AGENT_URL` + token) · hybrid preload bridge → main-process fetch
  (`AGENT_URL` + token). All three front-ends call through the shared client half —
  [`@indiecrafts/packages-shared-agent-client`](/packages/agent-client) (`callAgent`) — not their own fetch.
