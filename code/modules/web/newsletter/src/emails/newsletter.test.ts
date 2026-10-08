import { describe, expect, it } from "vitest";
import { renderNewsletterConfirmEmail } from "./newsletter-confirm";
import { renderNewsletterNotificationEmail } from "./newsletter-notification";

describe("renderNewsletterConfirmEmail", () => {
  const base = {
    subject: "Confirmez votre inscription",
    heading: "Plus qu'une étape",
    intro: "Merci !\nConfirmez votre adresse pour recevoir l'infolettre.",
    buttonLabel: "Confirmer",
    confirmUrl: "https://x.com/api/newsletter/confirm#t=abc",
  };

  it("puts the confirm URL in the button + text and renders intro lines as paragraphs", () => {
    const { subject, text, html } = renderNewsletterConfirmEmail(base);
    expect(subject).toBe("Confirmez votre inscription");
    expect(text).toContain("https://x.com/api/newsletter/confirm#t=abc");
    expect(html).toContain('href="https://x.com/api/newsletter/confirm#t=abc"');
    expect(html).toContain("Merci !"); // first intro line → its own <p>
    expect(html).toContain("Confirmez votre adresse pour recevoir"); // second line, apostrophe escaped in HTML
    expect(text).toContain(
      "Confirmez votre adresse pour recevoir l'infolettre.",
    ); // plain text keeps the apostrophe
  });

  it("escapes user-influenced copy in the HTML body", () => {
    const html = renderNewsletterConfirmEmail({
      ...base,
      intro: "<script>alert(1)</script>",
    }).html;
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });
});

describe("renderNewsletterNotificationEmail", () => {
  it("fills {{email}} and includes the language + source", () => {
    const { subject, text, html } = renderNewsletterNotificationEmail({
      subscriberEmail: "a@b.com",
      source: "/blog/x",
      subscriberLocale: "fr",
      subjectTemplate: "Nouvel abonné : {{email}}",
      locale: "fr",
    });
    expect(subject).toBe("Nouvel abonné : a@b.com");
    expect(text).toContain("Source : /blog/x");
    expect(text).toContain("Langue : fr");
    expect(html).not.toContain("/studio");
  });

  it("uses the default subject and omits source when absent", () => {
    const { subject, text } = renderNewsletterNotificationEmail({
      subscriberEmail: "a@b.com",
      locale: "fr",
    });
    expect(subject).toBe("Nouvel abonné à l'infolettre : a@b.com");
    expect(text).not.toContain("Source :");
  });

  it("follows the locale, English when it has no copy", () => {
    const base = {
      subscriberEmail: "a@b.com",
    };
    const fr = renderNewsletterNotificationEmail({ ...base, locale: "fr" });
    expect(fr.html).toContain("Nouvel abonné");
    expect(fr.text).toContain("E-mail : a@b.com");
    expect(fr.html).toContain('lang="fr"');
    for (const locale of ["en", "de"]) {
      const en = renderNewsletterNotificationEmail({ ...base, locale });
      expect(en.subject).toBe("New newsletter subscriber: a@b.com");
      expect(en.text).toContain("Email: a@b.com");
      expect(en.html).toContain('lang="en"');
    }
  });
});
