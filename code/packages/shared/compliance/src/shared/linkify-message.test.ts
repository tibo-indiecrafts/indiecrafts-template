import { describe, it, expect } from "vitest";
import { linkifyMessage } from "./legal";

describe("linkifyMessage", () => {
  it("weaves the ordered hrefs into the [[…]] markers, keeping surrounding text", () => {
    const parts = linkifyMessage(
      "We updated our [[Privacy Policy]] and [[Terms]].",
      ["/privacy-policy", "/terms"],
    );
    expect(parts).toEqual([
      "We updated our ",
      { label: "Privacy Policy", href: "/privacy-policy" },
      " and ",
      { label: "Terms", href: "/terms" },
      ".",
    ]);
  });

  it("falls back a marker to plain text when it has no matching href", () => {
    const parts = linkifyMessage("Read [[Privacy]] and [[Terms]].", [
      "/privacy-policy",
    ]);
    expect(parts).toEqual([
      "Read ",
      { label: "Privacy", href: "/privacy-policy" },
      " and ",
      "Terms", // no second href → plain label, never a raw "[[Terms]]"
      ".",
    ]);
  });

  it("returns the message unchanged when there are no markers", () => {
    expect(linkifyMessage("No links here.", ["/x"])).toEqual([
      "No links here.",
    ]);
  });
});
