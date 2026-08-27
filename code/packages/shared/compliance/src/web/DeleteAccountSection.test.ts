import { afterEach, describe, expect, it, vi } from "vitest";
import {
  submitAccountErasure,
  makeErasureFetcher,
} from "./DeleteAccountSection";

const base = {
  apiUrl: "https://api.example.test",
  getToken: async () => "tkn",
  email: "you@example.com",
};

function stubFetch(status: number, body: unknown = { ok: true }) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
}

afterEach(() => vi.restoreAllMocks());

describe("submitAccountErasure", () => {
  it("POSTs to /v1/erasure/self with a bearer token + typed email, 200 → done", async () => {
    const spy = stubFetch(200);
    const r = await submitAccountErasure(base);
    expect(r).toBe("done");
    const [url, init] = spy.mock.calls[0]!;
    expect(url).toBe("https://api.example.test/v1/erasure/self");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).headers).toMatchObject({
      authorization: "Bearer tkn",
    });
    expect((init as RequestInit).body).toBe(
      JSON.stringify({ email: "you@example.com" }),
    );
  });
  it("207 → partial (still erased)", async () => {
    stubFetch(207, { ok: true, partial: true, errors: [] });
    expect(await submitAccountErasure(base)).toBe("partial");
  });
  it("400 → mismatch", async () => {
    stubFetch(400, { error: "invalid" });
    expect(await submitAccountErasure(base)).toBe("mismatch");
  });
  it("401/500 → error", async () => {
    stubFetch(401, { error: "unauthorized" });
    expect(await submitAccountErasure(base)).toBe("error");
  });
  it("network throw → error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await submitAccountErasure(base)).toBe("error");
  });
});

describe("makeErasureFetcher (Clerk useReverification wrapping)", () => {
  const input = { apiUrl: base.apiUrl, getToken: base.getToken };

  it("maps a normal response to the status string (200 → done)", async () => {
    stubFetch(200);
    expect(await makeErasureFetcher(input)("you@example.com")).toBe("done");
  });

  it("returns the RAW reverification hint on 403 (not 'error'), so step-up fires", async () => {
    const hint = {
      clerk_error: {
        type: "forbidden",
        reason: "reverification-error",
        metadata: { reverification: { level: "first_factor", afterMinutes: 10 } },
      },
    };
    stubFetch(403, hint);
    const result = await makeErasureFetcher(input)("you@example.com");
    // The parsed body, not a status string — useReverification's isReverificationHint
    // detects this shape, prompts step-up, and retries.
    expect(result).toMatchObject(hint);
    expect(typeof result).toBe("object");
  });
});
