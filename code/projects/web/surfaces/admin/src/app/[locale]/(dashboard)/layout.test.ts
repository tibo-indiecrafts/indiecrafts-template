import { afterEach, describe, expect, it, vi } from "vitest";

// Data-layer admin re-check — the defense-in-depth gate behind the (bypassable)
// middleware. Mocks Clerk `auth` + spies on `redirect` (never lets it throw, so
// we can assert on its calls) and calls the async server component directly —
// JSX creation is lazy, so `<AppShell>` is never actually rendered/evaluated.
const { authMock, redirectMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({ auth: authMock }));
vi.mock("@/i18n/routing", () => ({ redirect: redirectMock }));

const { default: DashboardLayout } = await import("./layout");

const params = Promise.resolve({ locale: "en" });
const render = () => DashboardLayout({ children: null, params });

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("DashboardLayout", () => {
  it("redirects a signed-out caller when Clerk is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    authMock.mockResolvedValueOnce({ sessionClaims: null });
    await render();
    expect(redirectMock).toHaveBeenCalledWith({ href: "/sign-in", locale: "en" });
  });

  it("redirects a non-admin caller when Clerk is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    authMock.mockResolvedValueOnce({ sessionClaims: { metadata: { role: "editor" } } });
    await render();
    expect(redirectMock).toHaveBeenCalledWith({ href: "/sign-in", locale: "en" });
  });

  it("does not redirect an admin caller when Clerk is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    authMock.mockResolvedValueOnce({ sessionClaims: { metadata: { role: "admin" } } });
    await render();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("skips the gate (no redirect) when Clerk is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await render();
    expect(authMock).not.toHaveBeenCalled();
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
