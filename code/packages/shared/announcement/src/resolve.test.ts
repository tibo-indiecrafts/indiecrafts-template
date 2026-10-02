import { describe, it, expect } from "vitest";
import { resolveBanner, resolveToast } from "./resolve";
import type { RawBanner, RawToast } from "./types";

// A fixed clock so the date-window tests are deterministic (no Date.now() drift).
const NOW = Date.parse("2026-06-15T12:00:00Z");

const baseBanner: RawBanner = {
  enabled: true,
  dismissible: true,
  variant: "brand",
  surfaces: null,
  items: [{ message: { en: "Hello", fr: "Bonjour" }, link: null }],
};

describe("resolveBanner", () => {
  it("localizes the item message, falling back to the default locale", () => {
    expect(
      resolveBanner(baseBanner, { locale: "fr", surface: "app", now: NOW })
        .items[0]?.message,
    ).toBe("Bonjour");
    expect(
      resolveBanner(
        { ...baseBanner, items: [{ message: { en: "Hello" } }] },
        { locale: "fr", surface: "app", now: NOW },
      ).items[0]?.message,
    ).toBe("Hello");
  });

  it("is empty when disabled", () => {
    expect(
      resolveBanner(
        { ...baseBanner, enabled: false },
        { locale: "en", surface: "app", now: NOW },
      ).items,
    ).toHaveLength(0);
  });

  it("empty/unset surfaces = every surface; a list gates by membership", () => {
    expect(
      resolveBanner(baseBanner, { locale: "en", surface: "app", now: NOW })
        .items,
    ).toHaveLength(1);
    expect(
      resolveBanner(
        { ...baseBanner, surfaces: ["website"] },
        { locale: "en", surface: "app", now: NOW },
      ).items,
    ).toHaveLength(0);
    expect(
      resolveBanner(
        { ...baseBanner, surfaces: ["website", "app"] },
        { locale: "en", surface: "app", now: NOW },
      ).items,
    ).toHaveLength(1);
  });

  it("drops items outside their date window", () => {
    const future = {
      ...baseBanner,
      items: [{ message: { en: "Later" }, start: "2026-07-01T00:00:00Z" }],
    };
    expect(
      resolveBanner(future, { locale: "en", surface: "app", now: NOW }).items,
    ).toHaveLength(0);
  });

  it("hides the whole bar (and the toast) outside their own start/end window", () => {
    const at = { locale: "en" as const, surface: "app" as const, now: NOW };
    const past = "2026-06-01T00:00:00Z";
    const future = "2026-07-01T00:00:00Z";
    expect(resolveBanner({ ...baseBanner, end: past }, at).items).toHaveLength(
      0,
    );
    expect(
      resolveBanner({ ...baseBanner, start: future }, at).items,
    ).toHaveLength(0);
    expect(
      resolveBanner({ ...baseBanner, start: past, end: future }, at).items,
    ).toHaveLength(1);
    expect(resolveToast({ ...baseToast, end: past }, at)).toBeNull();
    expect(resolveToast({ ...baseToast, start: future }, at)).toBeNull();
  });

  it("hashes a stable version that changes with content", () => {
    const a = resolveBanner(baseBanner, {
      locale: "en",
      surface: "app",
      now: NOW,
    }).version;
    const b = resolveBanner(baseBanner, {
      locale: "en",
      surface: "app",
      now: NOW,
    }).version;
    const c = resolveBanner(
      { ...baseBanner, items: [{ message: { en: "Changed" } }] },
      { locale: "en", surface: "app", now: NOW },
    ).version;
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).not.toBe("");
  });
});

const baseToast: RawToast = {
  enabled: true,
  surfaces: null,
  title: { en: "New feature", fr: "Nouveauté" },
  body: { en: "Try it now" },
  image: { url: "https://cdn.sanity.io/images/p/d/abc.png" },
  imageAlt: { en: "Screenshot" },
  link: {
    linkType: "external",
    href: "https://example.com",
    newTab: true,
    label: { en: "Open" },
  },
  autoDismissSeconds: null,
};

describe("resolveToast", () => {
  it("returns null when disabled, off-surface, or title-less", () => {
    expect(
      resolveToast(
        { ...baseToast, enabled: false },
        { locale: "en", surface: "app", now: NOW },
      ),
    ).toBeNull();
    expect(
      resolveToast(
        { ...baseToast, surfaces: ["website"] },
        { locale: "en", surface: "app", now: NOW },
      ),
    ).toBeNull();
    expect(
      resolveToast(
        { ...baseToast, title: {} },
        { locale: "en", surface: "app", now: NOW },
      ),
    ).toBeNull();
  });

  it("sizes the image URL at the CDN", () => {
    expect(
      resolveToast(baseToast, { locale: "en", surface: "app", now: NOW })
        ?.imageUrl,
    ).toBe(
      "https://cdn.sanity.io/images/p/d/abc.png?w=128&auto=format&fit=max&q=75",
    );
  });

  it("converts editor seconds to a ms auto-dismiss; empty = persist (undefined)", () => {
    expect(
      resolveToast(
        { ...baseToast, autoDismissSeconds: 8 },
        { locale: "en", surface: "app", now: NOW },
      )?.autoDismissMs,
    ).toBe(8000);
    expect(
      resolveToast(baseToast, { locale: "en", surface: "app", now: NOW })
        ?.autoDismissMs,
    ).toBeUndefined();
  });

  it("drops a link whose href is not a site path or an http(s)/mailto/tel URL", () => {
    const withHref = (href: string) =>
      resolveToast(
        { ...baseToast, link: { ...baseToast.link, href } },
        { locale: "en", surface: "app", now: NOW },
      )?.link?.href;
    expect(withHref("/waitlist")).toBe("/waitlist");
    expect(withHref("https://example.com")).toBe("https://example.com");
    expect(withHref("mailto:hi@example.com")).toBe("mailto:hi@example.com");
    expect(withHref("javascript:alert(1)")).toBeUndefined();
    expect(withHref("//evil.example")).toBeUndefined();
    expect(withHref("example.com")).toBeUndefined();
  });

  it("resolves the link and localized fields", () => {
    const t = resolveToast(baseToast, {
      locale: "fr",
      surface: "app",
      now: NOW,
    });
    expect(t?.title).toBe("Nouveauté");
    expect(t?.link?.external).toBe(true);
    expect(t?.version).not.toBe("");
  });
});
