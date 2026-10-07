import { describe, expect, it, vi } from "vitest";

vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test");
vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "test");

describe("shared client", () => {
  // It carries a read token, and before API 2025-02-19 a token read defaults to the
  // `raw` perspective: drafts would reach the sitemap and every build-time read.
  it("reads published documents only", async () => {
    const { client } = await import("./client");
    expect(client.config().perspective).toBe("published");
  });
});
