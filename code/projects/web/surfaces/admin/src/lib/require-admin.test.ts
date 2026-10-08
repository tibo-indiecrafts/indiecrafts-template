// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

// The shared admin gate. `redirect` throws like the real next-intl one, so a caller
// that is not an admin never gets past the call.
const { authMock, redirectMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: authMock }));
vi.mock("@/i18n/routing", () => ({ redirect: redirectMock }));

const { requireAdminPage } = await import("./require-admin");

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("requireAdminPage", () => {
  it("fails closed without a Clerk key — redirects before it asks Clerk", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await expect(requireAdminPage("fr")).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith({ href: "/sign-in", locale: "fr" });
    expect(authMock).not.toHaveBeenCalled();
  });

  it.each([
    ["signed out", { sessionClaims: null }],
    ["a non-admin", { sessionClaims: { metadata: { role: "editor" } } }],
    ["no role claim", { sessionClaims: { metadata: {} } }],
  ])("redirects %s to sign-in", async (_label, session) => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    authMock.mockResolvedValueOnce(session);
    await expect(requireAdminPage("en")).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith({ href: "/sign-in", locale: "en" });
  });

  it("lets an admin through", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    authMock.mockResolvedValueOnce({ sessionClaims: { metadata: { role: "admin" } } });
    await expect(requireAdminPage("en")).resolves.toBeUndefined();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
