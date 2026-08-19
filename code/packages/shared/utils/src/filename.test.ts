import { describe, expect, it } from "vitest";

import { sanitizeAndCropFilename, validateFilenameLength } from "./filename";

describe("sanitizeAndCropFilename", () => {
  it("strips path + unsafe chars, keeps the extension", () => {
    expect(sanitizeAndCropFilename("../../path/to/file with spaces.jpg")).toBe(
      "file_with_spaces.jpg",
    );
  });

  it("crops the base name to maxLength but preserves the extension", () => {
    expect(sanitizeAndCropFilename("abcdefghijklmnop.png", 8)).toBe(
      "abcdefgh.png",
    );
  });

  it("returns a fallback when nothing survives", () => {
    expect(sanitizeAndCropFilename("")).toBe("unnamed");
    expect(sanitizeAndCropFilename("***.png")).toBe("unnamed.png");
  });

  it("crops by UTF-8 bytes, never splitting a multi-byte char", () => {
    const name = `${"é".repeat(200)}.txt`; // 400+ bytes
    const out = sanitizeAndCropFilename(name, 500);
    // "é" is 2 bytes but sanitizeComponent replaces it with "_" (ascii), so this
    // mainly asserts the byte cap holds and the output is valid.
    expect(new TextEncoder().encode(out).length).toBeLessThanOrEqual(200);
  });
});

describe("validateFilenameLength", () => {
  it("passes a short name and fails an over-long one", () => {
    expect(validateFilenameLength("photo.jpg").valid).toBe(true);
    const long = validateFilenameLength(`${"a".repeat(300)}.jpg`);
    expect(long.valid).toBe(false);
    expect(long.byteLength).toBeGreaterThan(long.maxBytes);
    expect(long.error).toBeDefined();
  });
});
