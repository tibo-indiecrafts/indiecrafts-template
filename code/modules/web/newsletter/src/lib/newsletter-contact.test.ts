// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

const { newsletterApiConfigured, subscribeContact } =
  await import("./newsletter-contact");

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
const input = {
  email: "a@b.com",
  locale: "fr",
  policyVersion: "v2",
  consentAt: "2026-10-08T10:00:00.000Z",
};

afterEach(() => {
  vi.unstubAllEnvs();
  fetchMock.mockReset();
});

describe("subscribeContact", () => {
  it("throws without the api wired — nothing could store the subscriber", async () => {
    expect(newsletterApiConfigured()).toBe(false);
    await expect(subscribeContact(input)).rejects.toThrow("unconfigured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the consent to the api with the server token", async () => {
    vi.stubEnv("API_URL", "https://api.test");
    vi.stubEnv("APP_API_TOKEN", "tok");
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    expect(newsletterApiConfigured()).toBe(true);
    await subscribeContact(input);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.test/v1/newsletter/subscribers");
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("authorization")).toBe("Bearer tok");
    expect(JSON.parse(String(init.body))).toEqual(input);
  });

  it("throws on an api error, so the confirmation never reports success", async () => {
    vi.stubEnv("API_URL", "https://api.test");
    vi.stubEnv("APP_API_TOKEN", "tok");
    fetchMock.mockResolvedValue(new Response(null, { status: 502 }));
    await expect(subscribeContact(input)).rejects.toThrow("502");
  });
});
