import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cronHealth,
  fetchCronStatus,
  type CronStatus,
} from "./monitoring";

const base: CronStatus = {
  lastRunAt: "2026-09-30T10:00:00Z",
  stale: false,
  runs: [
    {
      startedAt: "2026-09-30T10:00:00Z",
      finishedAt: "2026-09-30T10:00:01Z",
      status: "ok",
      passes: [],
    },
  ],
  erasure: { open: 0, dueSoon: 0, breached: 0 },
  exports: { outstanding: 0, expiredUnswept: 0 },
};

describe("cronHealth", () => {
  it("is unreachable when the api could not be read", () => {
    expect(cronHealth(null)).toBe("unreachable");
  });
  it("is never when no run was recorded", () => {
    expect(cronHealth({ ...base, lastRunAt: null, runs: [], stale: true })).toBe(
      "never",
    );
  });
  it("is stale before failed — an old failure means the cron stopped", () => {
    expect(
      cronHealth({
        ...base,
        stale: true,
        runs: [{ ...base.runs[0], status: "failed" }],
      }),
    ).toBe("stale");
  });
  it("is failed when the last run failed", () => {
    expect(
      cronHealth({ ...base, runs: [{ ...base.runs[0], status: "failed" }] }),
    ).toBe("failed");
  });
  it("is ok otherwise", () => {
    expect(cronHealth(base)).toBe("ok");
  });
});

describe("fetchCronStatus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns null (unreachable) when the api is not configured", async () => {
    vi.stubEnv("API_URL", "");
    expect(await fetchCronStatus()).toBeNull();
  });

  it("returns null when the api errors, never throws", async () => {
    vi.stubEnv("API_URL", "http://api.test");
    vi.stubEnv("APP_API_TOKEN", "t");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    expect(await fetchCronStatus()).toBeNull();
  });

  it("sends the server-side bearer and returns the payload", async () => {
    vi.stubEnv("API_URL", "http://api.test");
    vi.stubEnv("APP_API_TOKEN", "t");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(base), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await fetchCronStatus()).toEqual(base);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/v1/cron/status",
      expect.objectContaining({ headers: { authorization: "Bearer t" } }),
    );
  });
});
