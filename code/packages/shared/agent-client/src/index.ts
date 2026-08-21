/**
 * @indiecrafts/packages-shared-agent-client — the CLIENT half of the AI agent.
 *
 * `@indiecrafts/packages-shared-agent` is the SERVER half (it runs the model);
 * this is the ONE typed caller every surface's front-end shares to reach an agent
 * endpoint. It replaces three hand-rolled copies of the same
 * fetch + parse + never-throw contract: the web client (`ContentResearchAgent`),
 * the mobile `lib/agent.ts`, and the hybrid main process.
 *
 * Zero-dep + edge-safe (raw `fetch`, like the core). The URL prefix + auth are
 * INJECTED, never read from env — so the brick stays portable:
 *   - Worker callers (mobile · hybrid): urlPrefix `${base}/v1/agent`, a bearer `token`.
 *   - Web caller: urlPrefix `/api/agent` (same-origin, no bearer), a Turnstile
 *     token passed in `extraBody`.
 *
 * NEVER throws — a missing prefix, empty context, non-200, malformed body,
 * timeout, or network error all return `{ ok: false, error }`, so a caller
 * renders one failure branch.
 */

/** What a caller sends to an agent: the run context + the locale the result is written in. */
export type AgentClientRequest = {
  /** The run input — the task text. */
  context: string;
  /** BCP-47 locale (e.g. `"fr"`); the agent writes its output in this language. */
  locale?: string;
};

/** A never-throw result — the same discriminated shape as the agent core's `AgentResult`. */
export type AgentClientResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type CallAgentOptions = {
  /** URL the agent `name` is appended to. Worker: `${base}/v1/agent`; web route: `/api/agent`. */
  urlPrefix: string;
  /** Bearer token (the Worker's `APP_API_TOKEN` abuse gate). Omit for the same-origin web route. */
  token?: string;
  /** Extra body fields merged into the POST — e.g. `{ "cf-turnstile-response": token }` for the web route. */
  extraBody?: Record<string, unknown>;
  /** Injected fetch (default: the global `fetch`). */
  fetch?: typeof fetch;
  /** Abort the request after this many ms (default 30000). */
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Call one agent endpoint: `POST ${urlPrefix}/${name}` with `{ context, locale, ...extraBody }`,
 * then parse the `{ data }` envelope the agent core returns. Fails closed to
 * `{ ok: false, error }` on every error path.
 */
export async function callAgent<T = unknown>(
  name: string,
  request: AgentClientRequest,
  opts: CallAgentOptions,
): Promise<AgentClientResult<T>> {
  const doFetch = opts.fetch ?? globalThis.fetch;
  if (!doFetch) return { ok: false, error: "no fetch available" };
  if (!opts.urlPrefix) return { ok: false, error: "missing urlPrefix" };
  const context = request.context?.trim();
  if (!context) return { ok: false, error: "context is required" };

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );
  try {
    const res = await doFetch(`${opts.urlPrefix}/${name}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
      },
      // `undefined` values (an absent locale) are dropped by JSON.stringify.
      body: JSON.stringify({ context, locale: request.locale, ...opts.extraBody }),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, error: `agent ${res.status}` };
    const body = (await res.json()) as { data?: T };
    return body.data === undefined
      ? { ok: false, error: "malformed response" }
      : { ok: true, data: body.data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "request failed" };
  } finally {
    clearTimeout(timeout);
  }
}
