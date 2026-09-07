/**
 * @indiecrafts/packages-shared-agent — the shared, edge-safe core for a simple
 * goal-driven AI agent. ONE definition, run by the standalone `code/shared/agent`
 * Worker (behind its inline dual-mode guard — browser Turnstile / native bearer)
 * that every surface (web / mobile / hybrid) calls cross-origin.
 *
 * The 5-part formula (Goal · Instructions · Context · Tools · Output) is an
 * `AgentSpec`. `runAgent` calls the Anthropic Messages API with **raw fetch**
 * (zero deps, runs on Node 22 AND the Workers runtime — like `@indiecrafts/
 * packages-shared-security` `turnstile`), and **forces structured output** via a
 * single `output` tool so the result always matches the spec's `outputSchema`.
 *
 * The secret is ALWAYS caller-injected (`apiKey`) — this brick holds no keys and
 * reads no env; the calling server passes its `ANTHROPIC_API_KEY`. `runAgent`
 * NEVER throws — a bad key / network / parse returns `{ ok: false, error }`.
 * Human-in-the-loop: the result is a draft for a person to review, not an action.
 */
import { CONTENT_RESEARCH } from "./specs/content-research";
import { DEFAULT_MODEL } from "./model";

export { DEFAULT_MODEL };

/** A JSON Schema object describing the required output shape. */
export type OutputSchema = Record<string, unknown>;

/** The agent, as the 5-part formula. `tools` is intentionally omitted — v1 is reason-only. */
export type AgentSpec = {
  /** Registry key (the `/agent/:name` segment). */
  name: string;
  /** Claude model id. Default is fast + cheap; swap up for harder reasoning. */
  model: string;
  /** Goal — what to do. */
  goal: string;
  /** Instructions — the rules, incl. how to handle uncertainty. */
  instructions: string;
  /** Static background context (per-request context is appended to this). */
  context?: string;
  /** Output — the JSON Schema the result must match (forced via a tool). */
  outputSchema: OutputSchema;
};

/** What a caller sends: the run-specific context + the locale the result must be written in. */
export type AgentRequest = {
  /** The run input — audience, topic, the raw task text. */
  context: string;
  /** BCP-47 locale (e.g. `"fr"`, `"en"`). The agent writes ALL output in this language. Default `"en"`. */
  locale?: string;
};

/** What `runAgent` returns — a discriminated result, never a thrown error. */
export type AgentResult =
  { ok: true; data: unknown } | { ok: false; error: string };

/** The registry of available agents, keyed by `name`. Add a spec + a row here. */
export const SPECS: Record<string, AgentSpec> = {
  [CONTENT_RESEARCH.name]: CONTENT_RESEARCH,
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

/**
 * Run one agent: compose the system prompt from the spec, send the caller's
 * context as the user turn, and force the `output` tool so Claude returns JSON
 * matching `spec.outputSchema`. Returns the parsed structured data.
 */
export async function runAgent(
  spec: AgentSpec,
  input: AgentRequest,
  apiKey: string,
): Promise<AgentResult> {
  if (!apiKey) return { ok: false, error: "missing ANTHROPIC_API_KEY" };
  const context = input.context?.trim();
  if (!context) return { ok: false, error: "context is required" };

  // The result must be written in the caller's language — every output field value,
  // not the schema keys. The locale is a BCP-47 code from the app's active locale.
  const locale = input.locale?.trim() || "en";
  const language = `Write ALL output field values in the language for BCP-47 locale "${locale}" (e.g. "fr" = French, "en" = English). Keep the JSON keys unchanged.`;
  const system = [spec.goal, spec.instructions, spec.context, language]
    .filter(Boolean)
    .join("\n\n");

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: spec.model,
        max_tokens: 2048,
        system,
        messages: [{ role: "user", content: context }],
        // A single forced tool = reliable structured output, no prose to parse.
        tools: [
          {
            name: "output",
            description: "Return the result in exactly this shape.",
            input_schema: spec.outputSchema,
          },
        ],
        tool_choice: { type: "tool", name: "output" },
      }),
      // Never hang on a stalled/slow Anthropic response — the caller waits on this.
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return { ok: false, error: `anthropic ${res.status}` };

    const data = (await res.json()) as {
      content?: { type: string; name?: string; input?: unknown }[];
    };
    const tool = data.content?.find(
      (b) => b.type === "tool_use" && b.name === "output",
    );
    if (!tool) return { ok: false, error: "no structured output returned" };
    return { ok: true, data: tool.input };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "request failed",
    };
  }
}
