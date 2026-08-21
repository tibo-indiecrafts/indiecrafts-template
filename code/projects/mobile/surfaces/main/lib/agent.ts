/**
 * Calls the shared AI agent — the `code/shared/agent` Worker, `POST /v1/agent/:name`
 * (the single `@indiecrafts/packages-shared-agent` core, same one the web app uses).
 * Returns a **draft for a screen to render for HUMAN REVIEW** — never an action.
 *
 * The fetch + never-throw contract lives once in
 * `@indiecrafts/packages-shared-agent-client` (shared with the web + hybrid callers);
 * this file just injects the mobile env.
 *
 * `EXPO_PUBLIC_*` values are embedded in the app bundle, so the bearer token is an
 * abuse **gate**, not per-user auth (a bundle token is extractable). Real accounts
 * are the reserved `auth` package. Set both in the app's env / EAS secrets:
 *   EXPO_PUBLIC_AGENT_URL   = https://indiecrafts-<env>-shared-agent.<subdomain>.workers.dev
 *   EXPO_PUBLIC_AGENT_TOKEN = <the APP_API_TOKEN the worker checks>
 */
import {
  callAgent as call,
  type AgentClientResult,
} from "@indiecrafts/packages-shared-agent-client";

const BASE = process.env.EXPO_PUBLIC_AGENT_URL ?? "";
const TOKEN = process.env.EXPO_PUBLIC_AGENT_TOKEN ?? "";

export type AgentResult<T> = AgentClientResult<T>;

export function callAgent<T = unknown>(
  name: string,
  context: string,
  locale: string,
): Promise<AgentResult<T>> {
  if (!BASE || !TOKEN)
    return Promise.resolve({
      ok: false,
      error: "missing EXPO_PUBLIC_AGENT_URL / EXPO_PUBLIC_AGENT_TOKEN",
    });
  return call<T>(
    name,
    { context, locale },
    { urlPrefix: `${BASE}/v1/agent`, token: TOKEN },
  );
}
