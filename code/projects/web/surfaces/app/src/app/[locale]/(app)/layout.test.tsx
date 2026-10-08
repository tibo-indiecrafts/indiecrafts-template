import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

// The server-side auth gate (the proxy is only coarse routing). `redirect` throws like the
// real next-intl one, so code after it never runs.
const { authMock, redirectMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: authMock }));
vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "fr"] },
  redirect: redirectMock,
}));
vi.mock("@/user-interface/layout/AppShell", () => ({
  AppShell: ({ children }: { children: ReactNode }) => children,
}));

const { default: AppGroupLayout } = await import("./layout");
const run = (locale: string) =>
  AppGroupLayout({ children: "page", params: Promise.resolve({ locale }) });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("app (app) layout — signed-out gate", () => {
  it("redirects a signed-out visitor to the localized sign-in", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    authMock.mockResolvedValue({ userId: null });
    await expect(run("fr")).rejects.toThrow("NEXT_REDIRECT");
    expect(redirectMock).toHaveBeenCalledWith({ href: "/sign-in", locale: "fr" });
  });

  it("renders the shell for a signed-in user", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    authMock.mockResolvedValue({ userId: "user_1" });
    const tree = await run("en");
    expect(redirectMock).not.toHaveBeenCalled();
    expect(tree.props.children).toBe("page");
  });

  it("skips auth without a Clerk key (public scaffold)", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "");
    await run("en");
    expect(authMock).not.toHaveBeenCalled();
  });

  it("404s a non-locale segment before calling auth()", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
    await expect(run("favicon.ico")).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404",
    });
    expect(authMock).not.toHaveBeenCalled();
  });
});
