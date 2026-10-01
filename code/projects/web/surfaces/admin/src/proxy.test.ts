import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// Clerk on, and its middleware unwrapped so the test calls the inner handler directly.
vi.stubEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "pk_test_x");
const { authMock } = vi.hoisted(() => ({ authMock: vi.fn() }));
vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware:
    (handler: (auth: () => Promise<unknown>, req: NextRequest) => unknown) =>
    (req: NextRequest) =>
      handler(authMock, req),
}));

// next-intl's middleware does not load under vitest; the /api branch never reaches it.
vi.mock("next-intl/middleware", () => ({
  default: () => () => new Response(null, { headers: { "x-intl": "1" } }),
}));

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "fr"], defaultLocale: "en" },
}));

const { default: proxy, config } = await import("./proxy");
const run = (path: string) =>
  (proxy as unknown as (r: NextRequest) => Promise<Response>)(
    new NextRequest(`http://localhost${path}`, { method: "POST" }),
  );

// /api/session-log calls Clerk's auth(): Clerk's middleware must run there (or auth() throws
// "can't detect clerkMiddleware" and every sign-in log is a 500), and it must pass the call
// through — never a sign-in redirect or a locale rewrite (the route authorizes itself).
describe("proxy — Clerk-authenticated api routes", () => {
  it("matches /api/session-log so Clerk attaches the session", () => {
    expect(config.matcher).toContain("/api/session-log");
  });

  it("passes /api/session-log straight through, even with no signed-in user", async () => {
    authMock.mockResolvedValue({ userId: null, sessionClaims: null });
    const res = await run("/api/session-log");
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });
});
