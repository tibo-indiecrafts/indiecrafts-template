// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { defaultLocale } from "@/config";

const getLegalAcceptance = vi.hoisted(() =>
  vi.fn(async (_locale: string, _flags?: unknown) => ({
    version: "2026-09-01",
    pages: ["privacy"],
    required: true,
  })),
);
vi.mock("@indiecrafts/packages-web-compliance/sanity/legal", () => ({
  getLegalAcceptance,
}));

const { GET } = await import("./route");

describe("GET /api/legal-version", () => {
  it("exposes only the version — uncached, CORS-open for the app surface", async () => {
    const res = await GET();
    expect(await res.json()).toEqual({ version: "2026-09-01" });
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(getLegalAcceptance.mock.calls[0]?.[0]).toBe(defaultLocale);
  });
});
