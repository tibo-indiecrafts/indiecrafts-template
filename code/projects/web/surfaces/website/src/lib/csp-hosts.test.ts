import { afterEach, describe, expect, it, vi } from "vitest";

async function hosts() {
  vi.resetModules();
  return (await import("./csp-hosts")).websiteCspHosts;
}

describe("websiteCspHosts.connectSrc", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("allows the shared api origin the erasure and account forms call", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/base/");
    expect((await hosts()).connectSrc).toEqual(["https://api.example.com"]);
  });

  it("adds nothing without a valid api URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    expect((await hosts()).connectSrc).toEqual([]);
    vi.stubEnv("NEXT_PUBLIC_API_URL", "not a url");
    expect((await hosts()).connectSrc).toEqual([]);
  });
});
