import { describe, expect, it } from "vitest";
import { renderCommentNotificationEmail } from "./comment-notification";

describe("renderCommentNotificationEmail", () => {
  const base = {
    author: "Ada",
    postTitle: "Ship an MVP",
    postUrl: "https://x.com/blog/mvp",
    studioUrl: "https://x.com/studio",
    excerpt: "Great post!",
  };

  it("fills {{author}} / {{post}} in the subject and escapes the body", () => {
    const { subject, text, html } = renderCommentNotificationEmail({
      ...base,
      author: "<b>Ada</b>",
      subjectTemplate: "{{author}} sur {{post}}",
    });
    expect(subject).toBe("<b>Ada</b> sur Ship an MVP");
    expect(text).toContain("Great post!");
    expect(html).toContain("&lt;b&gt;Ada&lt;/b&gt;"); // escaped in HTML body
    expect(html).not.toContain("<b>Ada</b>");
  });

  it("uses the default subject and omits the email line when no author email", () => {
    const { subject, text } = renderCommentNotificationEmail({
      ...base,
      locale: "fr",
    });
    expect(subject).toBe("Nouveau commentaire à modérer : Ship an MVP");
    expect(text).not.toContain("E-mail :");
  });

  it("renders approve/spam/delete buttons only when actions are provided", () => {
    expect(renderCommentNotificationEmail(base).html).not.toContain(
      "action=approve",
    );

    const { html, text } = renderCommentNotificationEmail({
      ...base,
      locale: "fr",
      actions: {
        approveUrl:
          "https://x.com/api/comments/moderate?token=t&action=approve",
        spamUrl: "https://x.com/api/comments/moderate?token=t&action=spam",
        deleteUrl: "https://x.com/api/comments/moderate?token=t&action=delete",
      },
    });
    for (const a of ["action=approve", "action=spam", "action=delete"]) {
      expect(html).toContain(a);
      expect(text).toContain(a);
    }
    expect(html).toContain("Approuver");
  });

  it("an untitled post reads as a post in the alert's language", () => {
    const { postTitle: _, ...untitled } = base;
    expect(
      renderCommentNotificationEmail({ ...untitled, locale: "fr" }).text,
    ).toContain("un article");
    expect(
      renderCommentNotificationEmail({ ...untitled, locale: "en" }).text,
    ).toContain("a post");
  });

  it("follows the locale, English when it has no copy", () => {
    const fr = renderCommentNotificationEmail({ ...base, locale: "fr" });
    expect(fr.html).toContain("Nouveau commentaire à modérer");
    expect(fr.text).toContain("Auteur : Ada");
    expect(fr.html).toContain('lang="fr"');
    for (const locale of ["en", "de"]) {
      const en = renderCommentNotificationEmail({ ...base, locale });
      expect(en.subject).toBe("New comment to moderate: Ship an MVP");
      expect(en.text).toContain("Author: Ada");
      expect(en.html).toContain('lang="en"');
    }
  });
});
