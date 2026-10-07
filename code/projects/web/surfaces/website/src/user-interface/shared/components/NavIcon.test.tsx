import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { NavIcon } from "./NavIcon";

describe("NavIcon", () => {
  it("draws a curated glyph, hidden from screen readers", () => {
    const { container } = render(<NavIcon name="shield-check" size={18} />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
    expect(wrapper?.querySelector("svg")?.getAttribute("width")).toBe("18");
  });

  it("renders nothing for an empty or unknown name (e.g. a pre-migration Reicon name)", () => {
    for (const name of [undefined, "", "ShieldCheck"]) {
      expect(render(<NavIcon name={name} />).container.innerHTML).toBe("");
    }
  });
});
