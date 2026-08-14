import { describe, it, expect } from "vitest";
import { isSameSiteRequest } from "./origin";

// `Sec-Fetch-Site`, `Origin`, and `Host` are forbidden request headers — a real
// `new Request()` silently strips them, so we mock the only surface the function
// touches: `headers.get(name)`.
const req = (h: Record<string, string>): Request =>
  ({ headers: { get: (k: string) => h[k.toLowerCase()] ?? null } }) as unknown as Request;

describe("isSameSiteRequest", () => {
  it("blocks a cross-site POST", () => {
    expect(isSameSiteRequest(req({ "sec-fetch-site": "cross-site" }))).toBe(false);
  });
  it("allows same-origin / same-site", () => {
    expect(isSameSiteRequest(req({ "sec-fetch-site": "same-origin" }))).toBe(true);
    expect(isSameSiteRequest(req({ "sec-fetch-site": "same-site" }))).toBe(true);
  });
  it("allows a non-browser caller (no Origin / Sec-Fetch-Site)", () => {
    expect(isSameSiteRequest(req({}))).toBe(true);
  });
  it("allows a matching Origin host, blocks a mismatch (Sec-Fetch-Site absent)", () => {
    expect(isSameSiteRequest(req({ origin: "https://x.test", host: "x.test" }))).toBe(true);
    expect(isSameSiteRequest(req({ origin: "https://evil.test", host: "x.test" }))).toBe(false);
  });
  it("honours an extra-origin allowlist", () => {
    expect(isSameSiteRequest(req({ origin: "https://ok.test", host: "x.test" }), ["https://ok.test"])).toBe(true);
  });
  it("disables when allowed=false", () => {
    expect(isSameSiteRequest(req({ "sec-fetch-site": "cross-site" }), false)).toBe(true);
  });
});
