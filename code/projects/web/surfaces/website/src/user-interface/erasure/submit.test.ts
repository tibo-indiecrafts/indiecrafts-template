import { afterEach, describe, expect, it, vi } from "vitest";
import { submitErasureRequest } from "./submit";

const API_URL = "https://api.example.com";

function stubFetch(status: number) {
  const fetchMock = vi.fn(
    async (_url: string, _init?: RequestInit) => new Response(null, { status }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("submitErasureRequest", () => {
  it("posts a FormData body (email only) to /v1/erasure/request and returns \"sent\" on 200", async () => {
    const fetchMock = stubFetch(200);

    const result = await submitErasureRequest({
      apiUrl: API_URL,
      email: "person@example.com",
      turnstileToken: null,
    });

    expect(result).toBe("sent");
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(`${API_URL}/v1/erasure/request`);
    expect(init?.method).toBe("POST");
    const body = init?.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("email")).toBe("person@example.com");
    expect(body.has("cf-turnstile-response")).toBe(false);
  });

  it("includes cf-turnstile-response in the FormData when a token is passed", async () => {
    const fetchMock = stubFetch(200);

    await submitErasureRequest({
      apiUrl: API_URL,
      email: "person@example.com",
      turnstileToken: "solved-token",
    });

    const [, init] = fetchMock.mock.calls[0]!;
    const body = init?.body as FormData;
    expect(body.get("cf-turnstile-response")).toBe("solved-token");
  });

  it("returns \"turnstile\" on a 403", async () => {
    stubFetch(403);

    const result = await submitErasureRequest({
      apiUrl: API_URL,
      email: "person@example.com",
      turnstileToken: "bad-token",
    });

    expect(result).toBe("turnstile");
  });

  it("returns \"error\" on a 500", async () => {
    stubFetch(500);

    const result = await submitErasureRequest({
      apiUrl: API_URL,
      email: "person@example.com",
      turnstileToken: null,
    });

    expect(result).toBe("error");
  });

  it("returns \"error\" when fetch throws (network failure)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    const result = await submitErasureRequest({
      apiUrl: API_URL,
      email: "person@example.com",
      turnstileToken: null,
    });

    expect(result).toBe("error");
  });
});
