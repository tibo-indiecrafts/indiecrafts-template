import { describe, expect, it } from "vitest";
import {
  contactConfirmDefaults,
  renderContactConfirmEmail,
} from "./contact-confirm";

describe("renderContactConfirmEmail", () => {
  it("is in the recipient's language, with the support line in the HTML and the text", () => {
    const mail = renderContactConfirmEmail({
      ...contactConfirmDefaults("fr"),
      locale: "fr",
      supportEmail: "aide@x.com",
    });
    expect(mail.html).toContain('<html lang="fr">');
    expect(mail.html).toContain("Envoyé par");
    expect(mail.html).toContain("mailto:aide@x.com");
    expect(mail.text.endsWith("\n\nBesoin d'aide ? aide@x.com")).toBe(true);
  });

  it("has no support line without an address", () => {
    const mail = renderContactConfirmEmail({
      ...contactConfirmDefaults("en"),
      locale: "en",
    });
    expect(mail.subject).toBe("We received your message");
    expect(mail.html).not.toContain("mailto:");
    expect(mail.text).not.toContain("Need help?");
  });
});
