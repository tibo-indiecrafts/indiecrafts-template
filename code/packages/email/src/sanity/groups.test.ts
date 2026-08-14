import { describe, expect, it } from "vitest";
import type { FieldDefinition } from "sanity";
import { confirmationGroup, ownerAlertGroup } from "./groups";

/** The sub-field names of an object group (order-preserving). */
const names = (field: FieldDefinition): string[] =>
  ((field as { fields?: { name: string }[] }).fields ?? []).map((f) => f.name);

const confirmBase = {
  name: "x",
  title: "X",
  description: "d",
  enabledHint: "e",
  subjectHint: "s",
  introHint: "i",
  outroHint: "o",
};
const ownerBase = { name: "y", title: "Y", description: "d", enabledHint: "e", toHint: "t", subjectHint: "s" };

describe("confirmationGroup", () => {
  it("always ships bcc + the translated copy fields", () => {
    expect(names(confirmationGroup(confirmBase))).toEqual([
      "enabled",
      "from",
      "replyTo",
      "bcc",
      "subject",
      "heading",
      "intro",
      "outro",
    ]);
  });

  it("adds buttonLabel only with button:true", () => {
    expect(names(confirmationGroup({ ...confirmBase, button: true }))).toContain("buttonLabel");
    expect(names(confirmationGroup(confirmBase))).not.toContain("buttonLabel");
  });
});

describe("ownerAlertGroup", () => {
  it("ships recipients + a plain subject, no reply-to/moderation by default", () => {
    expect(names(ownerAlertGroup(ownerBase))).toEqual(["enabled", "to", "cc", "bcc", "from", "subject"]);
  });

  it("adds reply-to + moderation buttons when requested", () => {
    const g = ownerAlertGroup({ ...ownerBase, replyToHint: "r", moderationButtons: true });
    expect(names(g)).toContain("replyTo");
    expect(names(g)).toContain("moderationButtons");
  });
});
