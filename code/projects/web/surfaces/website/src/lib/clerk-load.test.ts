import { afterEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ userId: null as string | null }));
vi.mock("@clerk/nextjs/server", () => ({
  auth: async () => ({ userId: session.userId }),
}));

const { isClerkRoute, shouldLoadClerk } = await import("./clerk-load");

afterEach(() => {
  vi.unstubAllEnvs();
  session.userId = null;
});

describe("isClerkRoute", () => {
  it("matches the sign-in and sign-up pages, with or without a locale prefix", () => {
    for (const path of [
      "/sign-in",
      "/sign-up",
      "/fr/sign-in",
      "/fr/sign-up/verify-email-address",
      "/sign-in/factor-one",
    ]) {
      expect(isClerkRoute(path), path).toBe(true);
    }
  });
  it("leaves every other page out — Clerk is not loaded for a signed-out visitor there", () => {
    for (const path of [
      "/",
      "/fr",
      "/blog",
      "/account",
      "/fr/blog/sign-in-tips",
      "/sign-in-help",
    ]) {
      expect(isClerkRoute(path), path).toBe(false);
    }
  });
});

describe("shouldLoadClerk", () => {
  it("is off without a Clerk key", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    session.userId = "user_1";
    expect(await shouldLoadClerk("/sign-in")).toBe(false);
  });
  it("loads for the auth pages and for a signed-in visitor only", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    expect(await shouldLoadClerk("/fr/sign-up")).toBe(true);
    expect(await shouldLoadClerk("/blog")).toBe(false);
    expect(await shouldLoadClerk(null)).toBe(false);
    session.userId = "user_1";
    expect(await shouldLoadClerk("/blog")).toBe(true);
  });
});
