import { describe, expect, it } from "vitest";
import { buildInfo } from "@/lib/build-info";
import { GET } from "./route";

describe("GET /api/version", () => {
  it("returns the stamped build info with a no-store cache header", async () => {
    const res = GET();

    expect(res.headers.get("cache-control")).toBe("no-store, max-age=0");
    await expect(res.json()).resolves.toEqual({
      version: buildInfo.version,
      commit: buildInfo.commit,
    });
  });
});
