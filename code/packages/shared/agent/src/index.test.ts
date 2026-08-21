import { afterEach, describe, expect, it, vi } from "vitest";
import { runAgent, SPECS, type AgentSpec } from "./index";

const spec: AgentSpec = SPECS["content-research"];

/** Mock a single Anthropic response and capture the request that was sent. */
function mockFetch(response: unknown, ok = true, status = 200) {
  const calls: { url: string; body: any }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(String(init.body)) });
      return { ok, status, json: async () => response } as Response;
    }),
  );
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

const toolResponse = (input: unknown) => ({
  content: [{ type: "tool_use", name: "output", input }],
});

describe("runAgent", () => {
  it("forces the output tool and returns the parsed structured data", async () => {
    const data = { ideas: [{ topic: "x" }] };
    const calls = mockFetch(toolResponse(data));
    const result = await runAgent(spec, { context: "designers / AI" }, "sk-test");

    expect(result).toEqual({ ok: true, data });
    const body = calls[0].body;
    expect(body.tool_choice).toEqual({ type: "tool", name: "output" });
    expect(body.tools[0].name).toBe("output");
    expect(body.model).toBe(spec.model);
  });

  it("writes the result in the caller's locale (locale reaches the system prompt)", async () => {
    const calls = mockFetch(toolResponse({ ideas: [] }));
    await runAgent(spec, { context: "designers", locale: "fr" }, "sk-test");
    expect(calls[0].body.system).toContain('"fr"');
  });

  it("fails closed on a missing key", async () => {
    expect(await runAgent(spec, { context: "x" }, "")).toEqual({
      ok: false,
      error: "missing ANTHROPIC_API_KEY",
    });
  });

  it("requires context", async () => {
    const r = await runAgent(spec, { context: "   " }, "sk-test");
    expect(r.ok).toBe(false);
  });

  it("fails on a non-200 response", async () => {
    mockFetch({}, false, 500);
    const r = await runAgent(spec, { context: "x" }, "sk-test");
    expect(r).toEqual({ ok: false, error: "anthropic 500" });
  });

  it("fails when no structured output tool is returned", async () => {
    mockFetch({ content: [{ type: "text", text: "hi" }] });
    const r = await runAgent(spec, { context: "x" }, "sk-test");
    expect(r).toEqual({ ok: false, error: "no structured output returned" });
  });

  it("never throws — a fetch rejection becomes a result", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down"); }));
    const r = await runAgent(spec, { context: "x" }, "sk-test");
    expect(r).toEqual({ ok: false, error: "network down" });
  });
});
