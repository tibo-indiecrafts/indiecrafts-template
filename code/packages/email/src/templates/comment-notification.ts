import { escapeHtml, renderEmailLayout } from "../layout";

/** Everything the comment-notification email needs — plain data, no Sanity/blog types. */
export type CommentNotificationInput = {
  author: string;
  authorEmail?: string;
  postTitle: string;
  postUrl: string;
  studioUrl: string;
  excerpt: string;
  /** Optional subject with `{{author}}` / `{{post}}` placeholders. */
  subjectTemplate?: string;
  /** When set, render the one-click moderation buttons (each opens a confirm page). */
  actions?: { approveUrl: string; spamUrl: string; deleteUrl: string };
};

export type RenderedEmail = { subject: string; text: string; html: string };

const C = { muted: "#6b7280", accent: "#4f46e5", panel: "#f4f5f7", border: "#e6e8eb", body: "#374151" };

/** A pill button in a table cell (more mail-client-safe than inline-block). */
function btn(url: string, label: string, bg: string): string {
  return `<td style="padding:0 8px 0 0"><a href="${escapeHtml(url)}" style="display:inline-block;padding:10px 18px;background:${bg};color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${escapeHtml(label)}</a></td>`;
}

/**
 * The "a comment needs moderation" email. Owns its copy, subject, and both
 * bodies (plain-text + the branded HTML layout). The blog module passes data;
 * this renders it. With `actions`, adds Approve / Spam / Delete buttons — each
 * opens a confirm page (the mutation happens on that page's POST, never on the
 * email click, so a link-scanner can't auto-moderate).
 */
export function renderCommentNotificationEmail(input: CommentNotificationInput): RenderedEmail {
  const subject = (input.subjectTemplate?.trim() || "Nouveau commentaire à modérer : {{post}}")
    .replaceAll("{{author}}", input.author)
    .replaceAll("{{post}}", input.postTitle);

  const text = [
    "Un nouveau commentaire attend votre modération.",
    "",
    `Article : ${input.postTitle}`,
    input.postUrl,
    "",
    `Auteur : ${input.author}`,
    ...(input.authorEmail ? [`E-mail : ${input.authorEmail}`] : []),
    "",
    input.excerpt,
    "",
    `Modérer dans le Studio : ${input.studioUrl}`,
    ...(input.actions
      ? [
          "",
          "Modération rapide (ouvre une page de confirmation) :",
          `Approuver : ${input.actions.approveUrl}`,
          `Spam : ${input.actions.spamUrl}`,
          `Supprimer : ${input.actions.deleteUrl}`,
        ]
      : []),
  ].join("\n");

  const excerptHtml = escapeHtml(input.excerpt).replaceAll("\n", "<br>");
  const authorLine = input.authorEmail
    ? `${escapeHtml(input.author)} · ${escapeHtml(input.authorEmail)}`
    : escapeHtml(input.author);

  const actionsHtml = input.actions
    ? `<p style="margin:26px 0 8px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Modération rapide</p>` +
      `<table role="presentation" cellpadding="0" cellspacing="0"><tr>` +
      btn(input.actions.approveUrl, "Approuver", "#16a34a") +
      btn(input.actions.spamUrl, "Spam", C.muted) +
      btn(input.actions.deleteUrl, "Supprimer", "#dc2626") +
      `</tr></table>`
    : "";

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6">Un nouveau commentaire attend votre modération.</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Article</p>`,
    `<p style="margin:0 0 16px;font-size:15px"><a href="${escapeHtml(input.postUrl)}" style="color:${C.accent};text-decoration:none">${escapeHtml(input.postTitle)}</a></p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Auteur</p>`,
    `<p style="margin:0 0 20px;font-size:15px">${authorLine}</p>`,
    `<blockquote style="margin:0 0 28px;padding:14px 18px;background:${C.panel};border-left:3px solid ${C.border};border-radius:6px;color:${C.body};font-size:15px;line-height:1.6">${excerptHtml}</blockquote>`,
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:#111827;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Modérer dans le Studio</a>`,
    actionsHtml,
  ].join("");

  const html = renderEmailLayout({
    title: "Nouveau commentaire à modérer",
    preheader: `${input.author} — ${input.excerpt.slice(0, 90)}`,
    contentHtml,
    lang: "fr",
  });

  return { subject, text, html };
}
