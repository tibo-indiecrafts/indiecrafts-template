import {
  EMAIL_COLORS,
  escapeHtml,
  renderEmailLayout,
  type RenderedEmail,
} from "@indiecrafts/packages-web-email";

/** Owner alert on a new waitlist entry — operational (one team, not translated). */
export type WaitlistNotificationInput = {
  email: string;
  name?: string;
  source?: string;
  studioUrl: string;
  /** Optional subject with `{{email}}` / `{{name}}` placeholders. */
  subjectTemplate?: string;
  /** Editor overrides (resolved strings) — empty falls back to the defaults below. */
  heading?: string;
  intro?: string;
  outro?: string;
};

const C = EMAIL_COLORS;
const DEFAULT_HEADING = "Nouvelle inscription";
const DEFAULT_INTRO = "Une nouvelle personne a rejoint la liste d'attente.";

export function renderWaitlistNotificationEmail(
  input: WaitlistNotificationInput,
): RenderedEmail {
  const subject = (
    input.subjectTemplate?.trim() ||
    "Nouvelle inscription à la liste d'attente : {{email}}"
  )
    .replaceAll("{{email}}", input.email)
    .replaceAll("{{name}}", input.name ?? "");

  const heading = input.heading?.trim() || DEFAULT_HEADING;
  const intro = input.intro?.trim() || DEFAULT_INTRO;
  const outro = input.outro?.trim();

  const text = [
    intro,
    "",
    ...(input.name ? [`Nom : ${input.name}`] : []),
    `E-mail : ${input.email}`,
    ...(input.source ? [`Source : ${input.source}`] : []),
    "",
    `Voir la liste dans le Studio : ${input.studioUrl}`,
    ...(outro ? ["", outro] : []),
  ].join("\n");

  const row = (label: string, value: string) =>
    `<p style="margin:0 0 4px;color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:.04em">${label}</p><p style="margin:0 0 16px;font-size:15px;color:${C.body}">${escapeHtml(value)}</p>`;

  const contentHtml = [
    `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.body}">${escapeHtml(intro).replaceAll("\n", "<br>")}</p>`,
    input.name ? row("Nom", input.name) : "",
    row("E-mail", input.email),
    input.source ? row("Source", input.source) : "",
    `<a href="${escapeHtml(input.studioUrl)}" style="display:inline-block;padding:11px 20px;background:${C.heading};color:${C.card};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Voir la liste</a>`,
    outro
      ? `<p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${C.muted}">${escapeHtml(outro).replaceAll("\n", "<br>")}</p>`
      : "",
  ].join("");

  const html = renderEmailLayout({
    title: heading,
    preheader: input.name || input.email,
    contentHtml,
    lang: "fr",
  });

  return { subject, text, html };
}
