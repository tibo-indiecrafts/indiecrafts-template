// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

const logError = vi.hoisted(() => vi.fn());
vi.mock("@indiecrafts/packages-shared-logger", () => ({
  logger: { error: logError },
}));
const { getPopularPostIds, recordPostView } = await import("./popularity");

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
const env = () => {
  vi.stubEnv("API_URL", "https://api.test");
  vi.stubEnv("APP_API_TOKEN", "tok");
};

afterEach(() => {
  vi.unstubAllEnvs();
  fetchMock.mockReset();
  logError.mockClear();
});

describe("getPopularPostIds", () => {
  it("returns [] without the api wired (Trending falls back to the latest posts)", async () => {
    expect(await getPopularPostIds("en", 4)).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reads the most-viewed ids of the last 30 days for the locale, with the server token", async () => {
    env();
    fetchMock.mockResolvedValue(
      Response.json({ ids: ["post.b", "post.a", 3] }),
    );
    expect(await getPopularPostIds("fr", 4)).toEqual(["post.b", "post.a"]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.test/v1/views/top?locale=fr&limit=4&days=30");
    expect(init.headers.authorization).toBe("Bearer tok");
    expect(init.cache).toBe("no-store");
  });

  it("falls back to [] and logs when the api fails", async () => {
    env();
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));
    expect(await getPopularPostIds("en", 4)).toEqual([]);
    expect(logError).toHaveBeenCalledOnce();
  });
});

describe("recordPostView", () => {
  it("posts the view with the visitor's IP for the api's rate limit", async () => {
    env();
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await recordPostView({
      postId: "post.a",
      locale: "en",
      clientIp: "203.0.113.9",
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.test/v1/views");
    expect(init.method).toBe("POST");
    expect(init.headers["x-client-ip"]).toBe("203.0.113.9");
    expect(JSON.parse(init.body)).toEqual({ postId: "post.a", locale: "en" });
    expect(logError).not.toHaveBeenCalled();
  });

  it("treats a rate-limited view as expected, and logs a real failure without throwing", async () => {
    env();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 }));
    await recordPostView({ postId: "post.a", locale: "en" });
    expect(logError).not.toHaveBeenCalled();
    fetchMock.mockRejectedValue(new TypeError("network"));
    await expect(
      recordPostView({ postId: "post.a", locale: "en" }),
    ).resolves.toBeUndefined();
    expect(logError).toHaveBeenCalledOnce();
  });
});
