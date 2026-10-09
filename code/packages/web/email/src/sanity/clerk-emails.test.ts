import { describe, expect, it } from "vitest";
import { buildClerkEmails } from "./clerk-emails";

/** The `clerkEmails` groups that offer "Copie cachée à l'adresse de support". */
const withSupportCopy = () =>
  (
    buildClerkEmails() as {
      fields: { name: string; fields?: { name: string }[] }[];
    }
  ).fields
    .filter((g) => g.fields?.some((f) => f.name === "copySupport"))
    .map((g) => g.name)
    .sort();

describe("clerkEmails — the support copy", () => {
  it("is offered on the notices and welcome only, never on a code or a link", () => {
    expect(withSupportCopy()).toEqual(
      [
        "accountLocked",
        "mfaEnabled",
        "passkeyAdded",
        "passkeyRemoved",
        "passwordChanged",
        "passwordRemoved",
        "primaryEmailChanged",
        "welcome",
      ].sort(),
    );
  });
});
