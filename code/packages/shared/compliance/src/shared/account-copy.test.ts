import { describe, expect, it } from "vitest";
import { buildDeleteAccountCopy, buildExportCopy } from "./account-copy";

describe("account-copy builders", () => {
  it("buildDeleteAccountCopy maps every DeleteAccountCopy field", () => {
    const copy = buildDeleteAccountCopy((k) => `X:${k}`);
    expect(Object.keys(copy).sort()).toEqual([
      "body",
      "confirmButton",
      "emailLabel",
      "emailPlaceholder",
      "error",
      "heading",
      "mismatch",
      "partial",
      "pending",
      "success",
    ]);
    expect(copy.heading).toBe("X:heading");
    expect(copy.mismatch).toBe("X:mismatch");
  });

  it("buildExportCopy maps every ExportCopy field", () => {
    const copy = buildExportCopy((k) => `Y:${k}`);
    expect(Object.keys(copy).sort()).toEqual([
      "body",
      "button",
      "error",
      "heading",
      "pending",
      "success",
    ]);
    expect(copy.button).toBe("Y:button");
  });
});
