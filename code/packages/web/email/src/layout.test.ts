import { describe, expect, it } from "vitest";
import { escapeHtml, renderEmail, renderEmailLayout } from "./layout";

describe("escapeHtml", () => {
  it("neutralizes angle brackets, quotes, and ampersands", () => {
    expect(escapeHtml(`<script>"&'`)).toBe("&lt;script&gt;&quot;&amp;&#39;");
  });
});

describe("renderEmailLayout", () => {
  it("wraps content in a full document with the title + preheader", () => {
    const html = renderEmailLayout({
      title: "Hello",
      preheader: "Peek",
      contentHtml: "<p>Body</p>",
    });
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Hello");
    expect(html).toContain("Peek");
    expect(html).toContain("<p>Body</p>");
  });

  it("renders the support address in the footer when given", () => {
    const html = renderEmailLayout({
      title: "T",
      contentHtml: "<p>x</p>",
      supportEmail: "support@indiecrafts.dev",
    });
    expect(html).toContain("mailto:support@indiecrafts.dev");
    expect(html).toContain("support@indiecrafts.dev");
  });

  it("omits the support line when no address is given", () => {
    const html = renderEmailLayout({ title: "T", contentHtml: "<p>x</p>" });
    expect(html).not.toContain("mailto:");
  });
});

describe("footer language", () => {
  it.each([
    ["en", "Sent by", "Need help?"],
    ["fr", "Envoyé par", "Besoin d&#39;aide&nbsp;?"],
    ["de", "Sent by", "Need help?"], // any other language → English
  ])("a %s email has its footer in that language", (lang, sentBy, help) => {
    const html = renderEmailLayout({
      title: "T",
      contentHtml: "<p>x</p>",
      lang,
      supportEmail: "help@x.com",
    });
    expect(html).toContain(`<html lang="${lang}">`);
    expect(html).toContain(sentBy);
    expect(html).toContain(help);
  });
});

describe("renderEmail", () => {
  const base = {
    subject: "S",
    title: "T",
    contentHtml: "<p>x</p>",
    text: "Body",
  };

  it("puts the support line in the HTML and the plain text, in the email's language", () => {
    const en = renderEmail({
      ...base,
      lang: "en",
      supportEmail: " help@x.com ",
    });
    expect(en.subject).toBe("S");
    expect(en.text).toBe("Body\n\nNeed help? help@x.com");
    expect(en.html).toContain("mailto:help@x.com");
    const fr = renderEmail({ ...base, lang: "fr", supportEmail: "help@x.com" });
    expect(fr.text).toBe("Body\n\nBesoin d'aide ? help@x.com");
  });

  it("adds no support line when the address is empty", () => {
    const mail = renderEmail({ ...base, supportEmail: "  " });
    expect(mail.text).toBe("Body");
    expect(mail.html).not.toContain("mailto:");
  });
});
