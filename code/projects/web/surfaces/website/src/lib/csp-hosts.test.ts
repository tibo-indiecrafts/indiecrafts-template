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

describe("websiteCspHosts.frameAncestors", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("lets the site and the hosted Studio frame it (the Aperçu tab)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_STUDIO_URL", "https://acme.sanity.studio/");
    expect((await hosts()).frameAncestors).toEqual([
      "'self'",
      "https://acme.sanity.studio",
      "https://www.sanity.io", // Sanity's dashboard wraps every *.sanity.studio Studio
    ]);
  });

  it("adds no dashboard for a self-hosted Studio", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_STUDIO_URL", "https://studio.acme.com");
    expect((await hosts()).frameAncestors).toEqual(["'self'", "https://studio.acme.com"]);
  });

  it("keeps only the site itself without a valid Studio URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_STUDIO_URL", "");
    expect((await hosts()).frameAncestors).toEqual(["'self'"]);
    vi.stubEnv("NEXT_PUBLIC_SANITY_STUDIO_URL", "not a url");
    expect((await hosts()).frameAncestors).toEqual(["'self'"]);
  });
});
