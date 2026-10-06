import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const replace = vi.fn();
vi.mock("next-intl", () => ({ useLocale: () => "en" }));
vi.mock("./index", () => ({
  usePathname: () => "/account",
  useRouter: () => ({ replace }),
}));

const { useLocaleSwitch } = await import("./use-locale-switch");

describe("useLocaleSwitch", () => {
  beforeEach(() => {
    replace.mockClear();
    window.location.hash = "#/language";
  });

  it("re-prefixes the same page and keeps the hash", async () => {
    const { result } = renderHook(() => useLocaleSwitch());
    await result.current("fr");
    expect(replace).toHaveBeenCalledWith("/account#/language", {
      locale: "fr",
    });
  });

  it("goes to the resolved counterpart without the old hash", async () => {
    const resolve = vi.fn(async () => "/blog/mon-article");
    const { result } = renderHook(() => useLocaleSwitch(resolve));
    await result.current("fr");
    expect(resolve).toHaveBeenCalledWith("/account", "en", "fr");
    expect(replace).toHaveBeenCalledWith("/blog/mon-article", { locale: "fr" });
  });

  it("falls back to re-prefixing when the resolver fails", async () => {
    const resolve = vi.fn(async () => {
      throw new Error("offline");
    });
    const { result } = renderHook(() => useLocaleSwitch(resolve));
    await result.current("fr");
    expect(replace).toHaveBeenCalledWith("/account#/language", {
      locale: "fr",
    });
  });
});
