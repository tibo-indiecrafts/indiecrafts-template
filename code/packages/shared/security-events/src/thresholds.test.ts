import { describe, it, expect } from "vitest";
import { classifyFailedLogins, FAILED_LOGIN } from "./thresholds";
import { bumpCounter, type KvLike } from "./kv-counter";

describe("classifyFailedLogins", () => {
  it("stays quiet below the escalation threshold", () => {
    expect(classifyFailedLogins(FAILED_LOGIN.escalateAt - 1)).toBeNull();
  });
  it("escalates to credential_stuffing at the threshold", () => {
    const r = classifyFailedLogins(FAILED_LOGIN.escalateAt);
    expect(r?.eventType).toBe("credential_stuffing");
    expect(r?.severity).toBe("high");
  });
  it("marks a sustained burst critical", () => {
    expect(classifyFailedLogins(FAILED_LOGIN.escalateAt * 4)?.severity).toBe(
      "critical",
    );
  });
});

describe("bumpCounter", () => {
  function fakeKv() {
    const store = new Map<string, string>();
    const ttls: number[] = [];
    const kv: KvLike = {
      get: async (k) => store.get(k) ?? null,
      put: async (k, v, o) => {
        store.set(k, v);
        if (o?.expirationTtl != null) ttls.push(o.expirationTtl);
      },
    };
    return { kv, ttls };
  }

  it("increments and re-arms the TTL on each hit", async () => {
    const { kv, ttls } = fakeKv();
    expect(await bumpCounter(kv, "k", 900)).toBe(1);
    expect(await bumpCounter(kv, "k", 900)).toBe(2);
    expect(ttls).toEqual([900, 900]);
  });

  it("floors the TTL at 60s (the KV minimum)", async () => {
    const { kv, ttls } = fakeKv();
    await bumpCounter(kv, "k", 10);
    expect(ttls).toEqual([60]);
  });
});
