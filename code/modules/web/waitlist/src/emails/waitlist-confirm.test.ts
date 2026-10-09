import { describe, expect, it } from "vitest";
import {
  waitlistConfirmDefaults,
  renderWaitlistConfirmEmail,
} from "./waitlist-confirm";

describe("renderWaitlistConfirmEmail", () => {
  it("is in the recipient's language, with the support line in the HTML and the text", () => {
    const mail = renderWaitlistConfirmEmail({
      ...waitlistConfirmDefaults("fr"),
      locale: "fr",
      supportEmail: "aide@x.com",
    });
    expect(mail.html).toContain('<html lang="fr">');
    expect(mail.html).toContain("Envoyé par");
    expect(mail.html).toContain("mailto:aide@x.com");
    expect(mail.text.endsWith("\n\nBesoin d'aide ? aide@x.com")).toBe(true);
  });

  it("has no support line without an address", () => {
    const mail = renderWaitlistConfirmEmail({
      ...waitlistConfirmDefaults("en"),
      locale: "en",
    });
    expect(mail.subject).toBe("You're on the waitlist");
    expect(mail.html).not.toContain("mailto:");
    expect(mail.text).not.toContain("Need help?");
  });
});
