import { afterEach, describe, expect, it, vi } from "vitest";
import { liveQuery } from "./sanity-live";

const json = (result: unknown) =>
  vi.fn(
    async (_url: string) => new Response(JSON.stringify({ result }), { status: 200 }),
  );

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("liveQuery", () => {
  it("reads the query once, then serves the cache within the TTL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "p");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
    const fetch = json({ logo: "L" });
    vi.stubGlobal("fetch", fetch);
    const read = liveQuery<{ logo: string }>("*[0]", "test");
    expect(await read()).toEqual({ logo: "L" });
    expect(await read()).toEqual({ logo: "L" });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(String(fetch.mock.calls[0]![0])).toMatch(
      /^https:\/\/p\.apicdn\.sanity\.io\/.+\/production\?query=/,
    );
  });

  it("fails open: no project id, a non-200 or a throw → null, never an error", async () => {
    vi.stubGlobal("fetch", json({}));
    expect(await liveQuery("*", "test")()).toBeNull();
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "p");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 500 })),
    );
    expect(await liveQuery("*", "test")()).toBeNull();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    expect(await liveQuery("*", "test")()).toBeNull();
  });
});
