import { describe, expect, it } from "vitest";
import { validateDataRequest } from "./validate";
import { isDataRequestType } from "./request-types";

const ok = {
  email: "user@example.com",
  requestType: "erasure",
  consent: true,
  startedAt: 0,
};

describe("validateDataRequest", () => {
  it("accepts a valid request", () => {
    expect(validateDataRequest(ok)).toEqual({ ok: true });
  });

  it("rejects a bad email", () => {
    expect(validateDataRequest({ ...ok, email: "nope" })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("rejects an unknown request type", () => {
    expect(validateDataRequest({ ...ok, requestType: "sell-my-soul" })).toEqual(
      {
        ok: false,
        error: "invalid",
      },
    );
  });

  it("rejects without consent", () => {
    expect(validateDataRequest({ ...ok, consent: false })).toEqual({
      ok: false,
      error: "invalid",
    });
  });

  it("flags a filled honeypot as spam", () => {
    expect(validateDataRequest({ ...ok, honeypot: "bot" })).toEqual({
      ok: false,
      error: "spam",
    });
  });

  it("flags a near-instant submit as spam", () => {
    expect(validateDataRequest({ ...ok, startedAt: Date.now() })).toEqual({
      ok: false,
      error: "spam",
    });
  });
});

describe("isDataRequestType", () => {
  it("passes the 7 rights, rejects anything else", () => {
    expect(isDataRequestType("portability")).toBe(true);
    expect(isDataRequestType("withdraw-consent")).toBe(true);
    expect(isDataRequestType("delete-everything")).toBe(false);
    expect(isDataRequestType(null)).toBe(false);
  });
});
