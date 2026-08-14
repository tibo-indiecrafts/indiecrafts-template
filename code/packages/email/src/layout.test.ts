import { describe, expect, it } from "vitest";
import { escapeHtml, renderEmailLayout } from "./layout";
import { renderCommentNotificationEmail } from "./templates/comment-notification";

describe("escapeHtml", () => {
  it("neutralizes angle brackets, quotes, and ampersands", () => {
    expect(escapeHtml(`<script>"&'`)).toBe("&lt;script&gt;&quot;&amp;&#39;");
  });
});

describe("renderEmailLayout", () => {
  it("wraps content in a full document with the title + preheader", () => {
    const html = renderEmailLayout({ title: "Hello", preheader: "Peek", contentHtml: "<p>Body</p>" });
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("Hello");
    expect(html).toContain("Peek");
    expect(html).toContain("<p>Body</p>");
  });
});

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
    const { subject, text } = renderCommentNotificationEmail(base);
    expect(subject).toBe("Nouveau commentaire à modérer : Ship an MVP");
    expect(text).not.toContain("E-mail :");
  });

  it("renders approve/spam/delete buttons only when actions are provided", () => {
    expect(renderCommentNotificationEmail(base).html).not.toContain("action=approve");

    const { html, text } = renderCommentNotificationEmail({
      ...base,
      actions: {
        approveUrl: "https://x.com/api/comments/moderate?token=t&action=approve",
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
});
