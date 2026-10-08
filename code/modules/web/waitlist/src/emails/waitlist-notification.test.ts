import { describe, expect, it } from "vitest";
import { renderWaitlistNotificationEmail } from "./waitlist-notification";

describe("renderWaitlistNotificationEmail", () => {
  const base = {
    email: "a@b.com",
    name: "Ada",
    studioUrl: "https://x.com/studio",
  };

  it("follows the locale, English when it has no copy", () => {
    const fr = renderWaitlistNotificationEmail({ ...base, locale: "fr" });
    expect(fr.subject).toBe(
      "Nouvelle inscription à la liste d'attente : a@b.com",
    );
    expect(fr.text).toContain("Nom : Ada");
    expect(fr.html).toContain("Voir la liste");
    expect(fr.html).toContain('lang="fr"');
    for (const locale of ["en", "de"]) {
      const en = renderWaitlistNotificationEmail({ ...base, locale });
      expect(en.subject).toBe("New waitlist sign-up: a@b.com");
      expect(en.text).toContain("Name: Ada");
      expect(en.html).toContain("View the list");
      expect(en.html).toContain('lang="en"');
    }
  });
});
