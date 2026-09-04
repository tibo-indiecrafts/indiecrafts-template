import { describe, expect, it, vi } from "vitest";
import { i18n, localeCodes } from "@/config";

// `createNavigation` reaches into `next/navigation`, which vitest can't resolve
// out of Next 16's export map (a deep runtime dep, covered by e2e). Stub it so
// the *config* under test — `defineRouting`, which is real below — still loads.
vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: () => null,
    redirect: () => {},
    usePathname: () => "/",
    useRouter: () => ({}),
    getPathname: ({ href }: { href: string }) => href,
  }),
}));

const {
  getPathname,
  getStaticPathname,
  Link,
  redirect,
  routing,
  usePathname,
  useRouter,
} = await import("./routing");

// The middleware itself is exercised by e2e; here we lock the *config* the
// typed routing is built from, so a drift in locales / prefix strategy fails
// fast instead of only surfacing as a broken URL at runtime.
describe("routing config", () => {
  it("registers exactly the configured locales", () => {
    expect(routing.locales).toEqual([...localeCodes]);
    expect(routing.locales).toEqual(["en", "fr"]);
  });

  it("uses the configured default locale", () => {
    expect(routing.defaultLocale).toBe(i18n.defaultLocale);
    expect(routing.defaultLocale).toBe("en");
  });

  it("uses the `as-needed` prefix strategy from i18n config", () => {
    expect(routing.localePrefix).toBe(i18n.localePrefix);
    expect(routing.localePrefix).toBe("as-needed");
  });

  it("carries the configured locale detection + namespaced cookie", () => {
    expect(routing.localeDetection).toBe(i18n.localeDetection);
    expect(routing.localeCookie).toMatchObject({
      name: expect.stringContaining("NEXT_LOCALE"),
    });
  });
});

describe("routing navigation exports", () => {
  it("exposes the typed navigation helpers (never import next/link directly)", () => {
    for (const fn of [Link, redirect, usePathname, useRouter, getPathname]) {
      expect(fn).toBeTypeOf("function");
    }
  });
});

describe("getStaticPathname", () => {
  // Live per-locale URL resolution runs through next-intl's request-scoped
  // navigation (stubbed here) and is covered by e2e. At the unit level we only
  // assert the typed wrapper is exported and returns a string.
  it("is a callable string-returning wrapper", () => {
    expect(getStaticPathname).toBeTypeOf("function");
    expect(getStaticPathname("/", "en")).toBeTypeOf("string");
  });
});
