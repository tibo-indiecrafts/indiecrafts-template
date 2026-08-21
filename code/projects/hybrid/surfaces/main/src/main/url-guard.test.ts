import { describe, expect, it } from "vitest";
import { isSafeExternalUrl, parseOAuthCallback } from "./url-guard";

describe("isSafeExternalUrl", () => {
  it("allows real web URLs", () => {
    expect(isSafeExternalUrl("https://indiecrafts.dev/legal/terms")).toBe(true);
    expect(isSafeExternalUrl("http://localhost:3000")).toBe(true);
    expect(isSafeExternalUrl("HTTPS://EXAMPLE.COM")).toBe(true);
  });

  it("blocks non-web schemes a compromised renderer could abuse", () => {
    expect(isSafeExternalUrl("file:///etc/passwd")).toBe(false);
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("data:text/html,<script>")).toBe(false);
    expect(isSafeExternalUrl("chrome://settings")).toBe(false);
    expect(isSafeExternalUrl("//evil.com")).toBe(false);
  });

  it("blocks non-strings", () => {
    expect(isSafeExternalUrl(undefined)).toBe(false);
    expect(isSafeExternalUrl(null)).toBe(false);
    expect(isSafeExternalUrl(42)).toBe(false);
  });
});

describe("parseOAuthCallback", () => {
  it("accepts the exact callback with a valid state", () => {
    expect(parseOAuthCallback("indiecrafts://oauth-callback?state=abc123")).toEqual({
      state: "abc123",
      rotatingTokenNonce: undefined,
    });
  });

  it("accepts state + rotating_token_nonce", () => {
    expect(
      parseOAuthCallback(
        "indiecrafts://oauth-callback?state=abc123&rotating_token_nonce=nonce-9",
      ),
    ).toEqual({ state: "abc123", rotatingTokenNonce: "nonce-9" });
  });

  it("rejects a wrong scheme or host (a forged deep link)", () => {
    expect(parseOAuthCallback("https://oauth-callback?state=abc")).toBeNull();
    expect(parseOAuthCallback("indiecrafts://evil?state=abc")).toBeNull();
    expect(parseOAuthCallback("indiecrafts://oauth-callback/../x?state=abc")).toBeNull();
  });

  it("rejects a missing or illegal state", () => {
    expect(parseOAuthCallback("indiecrafts://oauth-callback")).toBeNull();
    expect(parseOAuthCallback("indiecrafts://oauth-callback?state=")).toBeNull();
    expect(
      parseOAuthCallback("indiecrafts://oauth-callback?state=<script>alert(1)"),
    ).toBeNull();
  });

  it("rejects a present-but-illegal nonce (poison → whole URL dropped)", () => {
    expect(
      parseOAuthCallback("indiecrafts://oauth-callback?state=ok&rotating_token_nonce=a b"),
    ).toBeNull();
  });

  it("rejects oversize input and non-strings", () => {
    const huge = "indiecrafts://oauth-callback?state=" + "a".repeat(5000);
    expect(parseOAuthCallback(huge)).toBeNull();
    expect(parseOAuthCallback(undefined)).toBeNull();
    expect(parseOAuthCallback(42)).toBeNull();
  });
});
