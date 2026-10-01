/// <reference types="@cloudflare/vitest-pool-workers" />
import { env } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import { type Env, rateLimitKey } from "./index";

// Server callers (the website forwarding a visitor's CSP report, consent, data request)
// all reach the api from the same server IP. A trusted caller names the visitor in
// `x-client-ip`, so one busy page can't spend the whole site's budget.
const req = (headers: Record<string, string>) =>
  new Request("https://api.example/v1/events", { headers });
const bearer = { authorization: "Bearer test-token" };

describe("rateLimitKey", () => {
  it("keys a trusted server call on the forwarded visitor IP", () => {
    const key = rateLimitKey(
      req({
        ...bearer,
        "cf-connecting-ip": "10.0.0.1",
        "x-client-ip": "203.0.113.7",
      }),
      env as unknown as Env,
    );
    expect(key).toBe("client:203.0.113.7");
  });

  it("accepts an IPv6 visitor", () => {
    const key = rateLimitKey(
      req({ ...bearer, "x-client-ip": "2001:db8::1" }),
      env as unknown as Env,
    );
    expect(key).toBe("client:2001:db8::1");
  });

  it("ignores x-client-ip without a valid bearer (a browser can't pick its own key)", () => {
    const key = rateLimitKey(
      req({
        authorization: "Bearer wrong",
        "cf-connecting-ip": "198.51.100.9",
        "x-client-ip": "203.0.113.7",
      }),
      env as unknown as Env,
    );
    expect(key).toBe("198.51.100.9");
  });

  it("ignores a malformed x-client-ip", () => {
    const key = rateLimitKey(
      req({
        ...bearer,
        "cf-connecting-ip": "10.0.0.1",
        "x-client-ip": "not an ip; drop",
      }),
      env as unknown as Env,
    );
    expect(key).toBe("10.0.0.1");
  });

  it("falls back to the connecting IP when nothing is forwarded", () => {
    const key = rateLimitKey(
      req({ ...bearer, "cf-connecting-ip": "10.0.0.1" }),
      env as unknown as Env,
    );
    expect(key).toBe("10.0.0.1");
  });
});
