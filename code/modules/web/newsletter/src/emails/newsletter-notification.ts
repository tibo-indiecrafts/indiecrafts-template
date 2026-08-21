import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Owner alert on a new subscriber — operational (one team, not translated). */
export type NewsletterNotificationInput = {
  subscriberEmail: string;
  source?: string;
  studioUrl: string;
  /** Optional subject with a `{{email}}` placeholder. */
  subjectTemplate?: string;
  /** Editor overrides (resolved strings) — empty falls back to the defaults below. */
  heading?: string;
  intro?: string;
  outro?: string;
};

const C = EMAIL_COLORS;
const DEFAULT_HEADING = "Nouvel abonné";
const DEFAULT_INTRO = "Un nouvel abonné vient de s'inscrire à l'infolettre.";

export function renderNewsletterNotificationEmail(
  input: NewsletterNotificationInput,
): RenderedEmail {
  const subject = (
    input.subjectTemplate?.trim() || "Nouvel abonné à l'infolettre : {{email}}"
  ).replaceAll("{{email}}", input.subscriberEmail);

  const heading = input.heading?.trim() || DEFAULT_HEADING;
  const intro = input.intro?.trim() || DEFAULT_INTRO;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    `E-mail : ${input.subscriberEmail}`,
    ...(input.source ? [`Source : ${input.source}`] : []),
    "",
    `Voir les abonnés dans le Studio : ${input.studioUrl}`,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">E-mail</p>`,
    `<p style="margin:0 0 16px;font-size:15px">${escapeHtml(input.subscriberEmail)}</p>`,
    input.source
      ? `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">Source</p><p style="margin:0 0 20px;font-size:15px">${escapeHtml(input.source)}</p>`
      : "",
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Voir les abonnés</a>`,
    outro
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: heading,
    preheader: input.subscriberEmail,
    contentHtml,
    lang: "fr",
  });

  return { subject, text, html };
}
