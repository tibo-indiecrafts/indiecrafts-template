import { describe, expect, it } from "vitest";
import { headingSkip } from "./blockContent";

const h = (level: number, text = `Title ${level}`) => ({
  _type: "block",
  style: `h${level}`,
  children: [{ text }],
});
const p = { _type: "block", style: "normal", children: [{ text: "Body" }] };

describe("headingSkip", () => {
  it("accepts a heading outline with no gap", () => {
    expect(headingSkip([h(2), p, h(3), h(4), h(2), h(3)])).toBeNull();
    expect(headingSkip([])).toBeNull();
    expect(headingSkip(undefined)).toBeNull();
  });

  it("lets the first heading start at any level and steps back up freely", () => {
    expect(headingSkip([h(3), h(4), h(2)])).toBeNull();
  });

  it("names the first heading that skips a level", () => {
    expect(headingSkip([h(2), p, h(4, "Guardrails")])).toContain(
      "« Guardrails » passe de H2 à H4",
    );
  });

  it("ignores non-block items such as inline modules", () => {
    expect(headingSkip([h(2), { _type: "module.callout" }, h(3)])).toBeNull();
  });
});
