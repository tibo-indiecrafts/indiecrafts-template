import { describe, expect, it } from "vitest";
import { overlayMessages } from "./overlay-messages";

describe("overlayMessages", () => {
  const base = { nav: { home: "Home", blog: "Blog" }, cta: { learnMore: "Learn more" } };

  it("overlays a Sanity value over the fallback", () => {
    expect(overlayMessages(base, { nav: { home: "Accueil" } })).toEqual({
      nav: { home: "Accueil", blog: "Blog" },
      cta: { learnMore: "Learn more" },
    });
  });

  it("keeps the fallback for blank or missing Sanity fields", () => {
    expect(overlayMessages(base, { nav: { home: "  " }, cta: {} })).toEqual(base);
  });

  it("returns the fallback untouched when Sanity is empty", () => {
    expect(overlayMessages(base, {})).toEqual(base);
    expect(overlayMessages(base, null)).toEqual(base);
  });
});
