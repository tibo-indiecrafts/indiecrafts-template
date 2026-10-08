import { describe, expect, it } from "vitest";
import { renderContactNotificationEmail } from "./contact-notification";

describe("renderContactNotificationEmail", () => {
  const base = {
    email: "a@b.com",
    name: "Ada",
    subject: "Hello",
    message: "Hi there",
    studioUrl: "https://x.com/studio",
  };

  it("follows the locale, English when it has no copy", () => {
    const fr = renderContactNotificationEmail({ ...base, locale: "fr" });
    expect(fr.subject).toBe("Nouveau message de contact : Hello");
    expect(fr.text).toContain("Nom : Ada");
    expect(fr.html).toContain("Voir dans le Studio");
    expect(fr.html).toContain('lang="fr"');
    for (const locale of ["en", "de"]) {
      const en = renderContactNotificationEmail({ ...base, locale });
      expect(en.subject).toBe("New contact message: Hello");
      expect(en.text).toContain("Name: Ada");
      expect(en.html).toContain("View in the Studio");
      expect(en.html).toContain('lang="en"');
    }
  });
});
