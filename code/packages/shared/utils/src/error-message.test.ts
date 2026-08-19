import { describe, expect, it } from "vitest";

import { getErrorMessage } from "./error-message";

describe("getErrorMessage", () => {
  it("joins Zod-style issue messages", () => {
    const zodLike = {
      issues: [
        { message: "Name is required" },
        { message: "Email is invalid" },
      ],
    };
    expect(getErrorMessage(zodLike)).toBe("Name is required. Email is invalid");
  });

  it("falls back to Error.message", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("stringifies anything else", () => {
    expect(getErrorMessage("plain string")).toBe("plain string");
    expect(getErrorMessage(42)).toBe("42");
    expect(getErrorMessage({ issues: [] })).toBe("[object Object]");
  });
});
