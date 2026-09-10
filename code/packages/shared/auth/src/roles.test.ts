import { describe, expect, it } from "vitest";
import { isAdmin, type AppSessionClaims } from "./roles";

describe("isAdmin", () => {
  it("is true for an admin claim", () => {
    expect(isAdmin({ metadata: { role: "admin" } })).toBe(true);
  });

  it("is false for null / undefined claims", () => {
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });

  it("is false when no role is present", () => {
    expect(isAdmin({})).toBe(false);
    expect(isAdmin({ metadata: {} })).toBe(false);
  });

  it("is false for a non-admin (e.g. a future moderator) role", () => {
    // A `moderator` — or any non-admin value — must never pass the admin gate.
    const moderator = {
      metadata: { role: "moderator" },
    } as unknown as AppSessionClaims;
    expect(isAdmin(moderator)).toBe(false);
    const empty = { metadata: { role: "" } } as unknown as AppSessionClaims;
    expect(isAdmin(empty)).toBe(false);
  });
});
