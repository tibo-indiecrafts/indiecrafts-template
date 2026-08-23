import { afterEach, describe, expect, it, vi } from "vitest";
import { submitAccountErasure } from "./DeleteAccountSection";

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
