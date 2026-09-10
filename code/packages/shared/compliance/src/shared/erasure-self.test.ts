import { afterEach, describe, expect, it, vi } from "vitest";
import {
  mapErasureResponse,
  rawErasureFetch,
  type ErasureFetchOutcome,
} from "./erasure-self";

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

describe("rawErasureFetch", () => {
  it("carries the numeric status on a normal response (a plain value, never a Response)", async () => {
    stubFetch(200);
    // useReverification auto-.json()s a returned Response and drops the status,
    // so the fetcher must hand back a status carrier instead.
    expect(await rawErasureFetch(base)).toEqual({ status: 200 });
  });

  it("returns Clerk's reverification hint body verbatim on a 403 so useReverification can detect it", async () => {
    const hint = {
      clerk_error: {
        type: "forbidden",
        reason: "reverification-error",
        metadata: {
          reverification: { level: "first_factor", afterMinutes: 10 },
        },
      },
    };
    stubFetch(403, hint);
    expect(await rawErasureFetch(base)).toEqual(hint);
  });

  it("a non-hint 403 falls back to a status carrier", async () => {
    stubFetch(403, { error: "nope" });
    expect(await rawErasureFetch(base)).toEqual({ status: 403 });
  });

  it("includes survey fields in the erasure-self body", async () => {
    const f = vi.fn().mockResolvedValue({ status: 200, ok: true });
    await rawErasureFetch(
      {
        apiUrl: "https://api",
        getToken: async () => "t",
        email: "u@x.com",
        reason: "too_hard",
        feedback: "confusing",
      },
      f as unknown as typeof fetch,
    );
    const body = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toMatchObject({
      email: "u@x.com",
      reason: "too_hard",
      feedback: "confusing",
    });
  });

  it("omits empty survey fields from the body", async () => {
    const f = vi.fn().mockResolvedValue({ status: 200, ok: true });
    await rawErasureFetch(base, f as unknown as typeof fetch);
    const body = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toEqual({ email: "you@example.com" });
  });
});

describe("mapErasureResponse", () => {
  it("maps status carriers to the result enum", () => {
    expect(mapErasureResponse({ status: 200 })).toBe("done");
    expect(mapErasureResponse({ status: 207 })).toBe("partial");
    expect(mapErasureResponse({ status: 400 })).toBe("mismatch");
    expect(mapErasureResponse({ status: 403 })).toBe("error");
    expect(mapErasureResponse({ status: 500 })).toBe("error");
  });

  it("maps a reverification hint body (no status) to error", () => {
    const hint: ErasureFetchOutcome = {
      clerk_error: { reason: "reverification-error" },
    };
    expect(mapErasureResponse(hint)).toBe("error");
  });
});
