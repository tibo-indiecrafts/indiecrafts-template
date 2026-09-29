import { describe, expect, it } from "vitest";
import { deepLinkPath, isExternalUrl } from "./shell-links";

const APP = "https://app.example.com";

describe("isExternalUrl", () => {
  it("is true only for a cross-origin http(s) URL", () => {
    expect(isExternalUrl("https://example.com/privacy-policy", APP)).toBe(true);
    expect(isExternalUrl("http://other.test/x", APP)).toBe(true);
    expect(isExternalUrl("//other.test/x", APP)).toBe(true);
  });
  it("keeps relative, same-origin and hash links in the web view", () => {
    expect(isExternalUrl("/account", APP)).toBe(false);
    expect(isExternalUrl("account?tab=data", APP)).toBe(false);
    expect(isExternalUrl(`${APP}/legal`, APP)).toBe(false);
    expect(isExternalUrl("#main", APP)).toBe(false);
  });
  it("leaves non-http schemes and malformed hrefs alone", () => {
    expect(isExternalUrl("mailto:hi@example.com", APP)).toBe(false);
    expect(isExternalUrl("tel:+33100000000", APP)).toBe(false);
    expect(isExternalUrl("javascript:void(0)", APP)).toBe(false);
    expect(isExternalUrl("http://[bad", APP)).toBe(false);
  });
});

describe("deepLinkPath", () => {
  it("maps host + path + query to an in-app path", () => {
    expect(deepLinkPath("indiecrafts://account?tab=data")).toBe(
      "/account?tab=data",
    );
    expect(deepLinkPath("indiecrafts://legal/privacy")).toBe("/legal/privacy");
    expect(deepLinkPath("indiecrafts://account/")).toBe("/account");
  });
  it("falls back to the root for an empty or malformed link", () => {
    expect(deepLinkPath("indiecrafts://")).toBe("/");
    expect(deepLinkPath("not a url")).toBe("/");
  });
});
