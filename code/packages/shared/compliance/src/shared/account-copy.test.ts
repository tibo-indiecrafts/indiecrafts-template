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
      "survey",
    ]);
    expect(copy.heading).toBe("X:heading");
    expect(copy.mismatch).toBe("X:mismatch");
    expect(Object.keys(copy.survey).sort()).toEqual([
      "competitorLabel",
      "competitorPlaceholder",
      "feedbackLabel",
      "feedbackPlaceholder",
      "legend",
      "reasonLabel",
      "reasons",
    ]);
    expect(copy.survey.legend).toBe("X:survey.legend");
    expect(Object.keys(copy.survey.reasons).sort()).toEqual([
      "found_alternative",
      "missing_feature",
      "not_using",
      "other",
      "privacy",
      "too_expensive",
      "too_hard",
    ]);
    expect(copy.survey.reasons.too_hard).toBe("X:survey.reasons.too_hard");
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
