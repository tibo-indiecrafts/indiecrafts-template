import { describe, it, expect } from "vitest";
import { isUpdateAvailable, versionId, VERSION_ENDPOINT } from "./version";

describe("isUpdateAvailable", () => {
  it("is false while the live id is unknown (not yet polled)", () => {
    expect(isUpdateAvailable("abc123", null)).toBe(false);
  });
  it("is false when the live id matches the running bundle", () => {
    expect(isUpdateAvailable("abc123", "abc123")).toBe(false);
  });
  it("is true when the live id differs — a new build shipped", () => {
    expect(isUpdateAvailable("abc123", "def456")).toBe(true);
  });
});

describe("versionId", () => {
  it("prefers commit over version", () => {
    expect(versionId({ commit: "sha", version: "1.2.3" })).toBe("sha");
  });
  it("falls back to version when there is no commit", () => {
    expect(versionId({ version: "1.2.3" })).toBe("1.2.3");
  });
  it("is null for an empty response", () => {
    expect(versionId({})).toBe(null);
  });
});

describe("VERSION_ENDPOINT", () => {
  it("is the conventional path", () => {
    expect(VERSION_ENDPOINT).toBe("/api/version");
  });
});
