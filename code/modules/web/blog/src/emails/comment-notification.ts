/**
 * Render the blog's comment-moderation notification email.
 *
 * @see docs/reference/modules/web/blog/src/emails/comment-notification.md
 */
import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmail,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Everything the comment-notification email needs — plain data, no Sanity/blog types. */
export type CommentNotificationInput = {
  /** The operator's locale — the site's `defaultLocale`; any locale without copy gets English. */
  locale?: string;
  author: string;
  authorEmail?: string;
  /** Empty → "a post" in the alert's language. */
  postTitle?: string;
  postUrl: string;
  studioUrl: string;
  excerpt: string;
  /** Optional subject with `{{author}}` / `{{post}}` placeholders. */
  subjectTemplate?: string;
  /** Editor overrides (resolved strings) — empty falls back to the defaults below. */
  heading?: string;
  intro?: string;
  outro?: string;
  /** When set, render the one-click moderation buttons (each opens a confirm page). */
  actions?: { approveUrl: string; spamUrl: string; deleteUrl: string };
  supportEmail?: string;
};

const C = EMAIL_COLORS;
/** No design token for a "success" green — the only email-specific hex left. */
const APPROVE_GREEN = "#16a34a";

/** Last-resort copy when a Studio field is empty, per locale; any other locale gets English. */
const EN = {
  heading: "New comment to moderate",
  intro: "A new comment is waiting for your moderation.",
  subject: "New comment to moderate: {{post}}",
  colon: ":",
  post: "Post",
  author: "Author",
  email: "Email",
  studio: "Moderate in the Studio",
  quick: "Quick moderation",
  quickHint: "opens a confirmation page",
  approve: "Approve",
  spam: "Spam",
  delete: "Delete",
  untitled: "a post",
};

const COPY: Record<string, typeof EN> = {
  en: EN,
  fr: {
    heading: "Nouveau commentaire à modérer",
    intro: "Un nouveau commentaire attend votre modération.",
    subject: "Nouveau commentaire à modérer : {{post}}",
    colon: " :",
    post: "Article",
    author: "Auteur",
    email: "E-mail",
    studio: "Modérer dans le Studio",
    quick: "Modération rapide",
    quickHint: "ouvre une page de confirmation",
    approve: "Approuver",
    spam: "Spam",
    delete: "Supprimer",
    untitled: "un article",
  },
};

/** A pill button in a table cell (more mail-client-safe than inline-block). */
function btn(url: string, label: string, bg: string): string {
  return `<td style="padding:0 8px 0 0"><a href="${escapeHtml(url)}" style="display:inline-block;padding:10px 18px;background:${bg};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${escapeHtml(label)}</a></td>`;
}

/**
 * The "a comment needs moderation" email. Owns its copy, subject, and both
 * bodies (plain-text + the branded HTML layout). The blog module passes data;
 * this renders it. With `actions`, adds Approve / Spam / Delete buttons — each
 * opens a confirm page (the mutation happens on that page's POST, never on the
 * email click, so a link-scanner can't auto-moderate).
 */
export function renderCommentNotificationEmail(
  input: CommentNotificationInput,
): RenderedEmail {
  const lang = input.locale && COPY[input.locale] ? input.locale : "en";
  const copy = COPY[lang] ?? EN;
  const postTitle = input.postTitle?.trim() || copy.untitled;
  const subject = (input.subjectTemplate?.trim() || copy.subject)
    .replaceAll("{{author}}", input.author)
    .replaceAll("{{post}}", postTitle);

  const heading = input.heading?.trim() || copy.heading;
  const intro = input.intro?.trim() || copy.intro;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    `${copy.post}${copy.colon} ${postTitle}`,
    input.postUrl,
    "",
    `${copy.author}${copy.colon} ${input.author}`,
    ...(input.authorEmail
      ? [`${copy.email}${copy.colon} ${input.authorEmail}`]
      : []),
    "",
    input.excerpt,
    "",
    `${copy.studio}${copy.colon} ${input.studioUrl}`,
    ...(input.actions
      ? [
          "",
          `${copy.quick} (${copy.quickHint})${copy.colon}`,
          `${copy.approve}${copy.colon} ${input.actions.approveUrl}`,
          `${copy.spam}${copy.colon} ${input.actions.spamUrl}`,
          `${copy.delete}${copy.colon} ${input.actions.deleteUrl}`,
        ]
      : []),
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const excerptHtml = escapeHtml(input.excerpt).replaceAll("\n", "<br>");
  const authorLine = input.authorEmail
    ? `${escapeHtml(input.author)} · ${escapeHtml(input.authorEmail)}`
    : escapeHtml(input.author);

  const actionsHtml = input.actions
    ? `<p style="margin:26px 0 8px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.quick}</p>` +
      `<table role="presentation" cellpadding="0" cellspacing="0"><tr>` +
      btn(input.actions.approveUrl, copy.approve, APPROVE_GREEN) +
      btn(input.actions.spamUrl, copy.spam, C.muted) +
      btn(input.actions.deleteUrl, copy.delete, C.destructive) +
      `</tr></table>`
    : "";

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.post}</p>`,
    `<p style="margin:0 0 16px;font-size:15px"><a href="${escapeHtml(input.postUrl)}" style="color:${C.accent};text-decoration:none">${escapeHtml(postTitle)}</a></p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${copy.author}</p>`,
    `<p style="margin:0 0 20px;font-size:15px">${authorLine}</p>`,
    `<blockquote style="margin:0 0 28px;padding:14px 18px;background:${C.panel};border-left:3px solid ${C.border};border-radius:6px;color:${C.body};font-size:15px;line-height:1.6">${excerptHtml}</blockquote>`,
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">${copy.studio}</a>`,
    actionsHtml,
    outro
      ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  return renderEmail({
    subject,
    text,
    title: heading,
    preheader: `${input.author} — ${input.excerpt.slice(0, 90)}`,
    contentHtml,
    lang,
    supportEmail: input.supportEmail,
  });
}
