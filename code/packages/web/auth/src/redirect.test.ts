import { describe, expect, it } from "vitest";
import { isSafeRelativePath, resolveSignInRedirect } from "./redirect";

describe("isSafeRelativePath", () => {
  it("accepts a same-origin relative path", () => {
    expect(isSafeRelativePath("/")).toBe(true);
    expect(isSafeRelativePath("/blog/post")).toBe(true);
    expect(isSafeRelativePath("/fr/account?tab=1")).toBe(true);
    expect(isSafeRelativePath("/blog-post")).toBe(true);
  });

  it("rejects absolute / cross-origin / protocol-relative targets", () => {
    expect(isSafeRelativePath("https://evil.example")).toBe(false);
    expect(isSafeRelativePath("//evil.example")).toBe(false);
    expect(isSafeRelativePath("http:/x")).toBe(false);
    expect(isSafeRelativePath("/\\evil")).toBe(false);
    expect(isSafeRelativePath("javascript:alert(1)")).toBe(false);
  });

  it("rejects non-strings, empty, and control chars", () => {
    expect(isSafeRelativePath(null)).toBe(false);
    expect(isSafeRelativePath(undefined)).toBe(false);
    expect(isSafeRelativePath("")).toBe(false);
    expect(isSafeRelativePath("/a\nb")).toBe(false);
  });
});

describe("resolveSignInRedirect", () => {
  it("keeps a safe redirect_url over home", () => {
    expect(resolveSignInRedirect("/blog", "/")).toBe("/blog");
  });

  it("falls back to home for an unsafe or absent redirect_url", () => {
    expect(resolveSignInRedirect("https://evil.example", "/")).toBe("/");
    expect(resolveSignInRedirect(null, "/home")).toBe("/home");
  });

  it("lets a safe force override, but ignores an unsafe force", () => {
    expect(resolveSignInRedirect("/blog", "/", "/account")).toBe("/account");
    expect(resolveSignInRedirect("/blog", "/", "https://evil")).toBe("/blog");
  });
});
