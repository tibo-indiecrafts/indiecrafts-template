// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

const logError = vi.hoisted(() => vi.fn());
vi.mock("@indiecrafts/packages-shared-logger", () => ({
  logger: { error: logError },
}));
const { syncNewsletterContact } = await import("./newsletter-contact");

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
const input = { email: "a@b.com", locale: "fr", granted: true };

afterEach(() => {
  vi.unstubAllEnvs();
  fetchMock.mockReset();
  logError.mockClear();
});

describe("syncNewsletterContact", () => {
  it("does nothing without the api wired (the list stays Sanity-only)", async () => {
    await syncNewsletterContact(input);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the subscriber to the api with the server token", async () => {
    vi.stubEnv("API_URL", "https://api.test");
    vi.stubEnv("APP_API_TOKEN", "tok");
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await syncNewsletterContact(input);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.test/v1/newsletter/subscribers");
    expect(init.method).toBe("POST");
    expect(init.headers.authorization).toBe("Bearer tok");
    expect(JSON.parse(init.body)).toEqual(input);
    expect(logError).not.toHaveBeenCalled();
  });

  it("logs a failed sync without the address, and never throws", async () => {
    vi.stubEnv("API_URL", "https://api.test");
    vi.stubEnv("APP_API_TOKEN", "tok");
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));
    await expect(syncNewsletterContact(input)).resolves.toBeUndefined();
    expect(logError).toHaveBeenCalledOnce();
    expect(JSON.stringify(logError.mock.calls[0])).not.toContain("a@b.com");
  });
});
