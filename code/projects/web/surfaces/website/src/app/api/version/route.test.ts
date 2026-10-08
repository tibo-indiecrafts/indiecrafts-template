// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildInfo } from "@/lib/build-info";
import { GET } from "./route";

describe("GET /api/version", () => {
  it("returns the build id + commit only, uncached", async () => {
    const res = GET();
    expect(await res.json()).toEqual({
      version: buildInfo.version,
      commit: buildInfo.commit,
    });
    expect(res.headers.get("cache-control")).toContain("no-store");
  });
});
