/**
 * Send the data-request receipt and closing emails, in the requester's language.
 *
 * @see docs/reference/shared/api/src/data-request/email.md
 */
// Both emails go to the requester, in the request's own locale (en/fr). Copy comes from the
// Studio-editable `emailStrings` groups `dataRequestReceipt` / `dataRequestClosed` (placeholders
// {{id}} {{right}} {{due}} {{outcome}}), each field falling back to the built-in text below.
// `enabled: false` in Studio turns an email off. Returns true only when Resend accepted it.
import { pickLocale } from "@indiecrafts/packages-shared-config";
import {
  escapeHtml,
  fetchEmailStrings,
  resend,
  supportCopyOf,
  supportFooter,
  type MailEnv,
} from "../erasure/email";
import { dueAt } from "./shared";

type L = "en" | "fr";
type LocaleValue =
  Record<string, string | undefined> | string | null | undefined;
type Group = {
  enabled?: boolean;
  /** Blind-copy the support address (Studio "Copie cachée à l'adresse de support"). */
  copySupport?: boolean;
  subject?: LocaleValue;
  heading?: LocaleValue;
  intro?: LocaleValue;
  outro?: LocaleValue;
};
type Strings = {
  dataRequestReceipt?: Group;
  dataRequestClosed?: Group;
  supportEmail?: string;
  bccAll?: string;
};
type FetchStrings = (env: MailEnv) => Promise<Strings | null>;

const lang = (locale: string | null | undefined): L =>
  locale?.startsWith("fr") ? "fr" : "en";
const pick = (v: LocaleValue, l: L) => pickLocale(v, l) || undefined;
const fill = (s: string, vars: Record<string, string>) =>
  s.replace(/\{\{(\w+)\}\}/g, (m, k: string) => vars[k] ?? m);
const para = (s: string) => `<p>${escapeHtml(s).replaceAll("\n", "<br>")}</p>`;

// The right as it reads inside the sentence ("Your access request" / "Votre demande d'accès").
const RIGHTS: Record<L, Record<string, string>> = {
  en: {
    access: "access",
    rectification: "rectification",
    erasure: "erasure",
    restriction: "restriction",
    portability: "portability",
    objection: "objection",
    "withdraw-consent": "consent withdrawal",
  },
  fr: {
    access: "d'accès",
    rectification: "de rectification",
    erasure: "d'effacement",
    restriction: "de limitation du traitement",
    portability: "de portabilité",
    objection: "d'opposition",
    "withdraw-consent": "de retrait du consentement",
  },
};

const RECEIPT: Record<
  L,
  Record<"subject" | "heading" | "intro" | "outro", string>
> = {
  en: {
    subject: "We received your request (#{{id}})",
    heading: "We received your request.",
    intro:
      "Your {{right}} request (reference #{{id}}) has reached us. We will answer by {{due}} at the latest.",
    outro: "If you did not send this request, you can ignore this email.",
  },
  fr: {
    subject: "Nous avons bien reçu votre demande (n° {{id}})",
    heading: "Nous avons bien reçu votre demande.",
    intro:
      "Votre demande {{right}} (référence n° {{id}}) nous est parvenue. Nous vous répondrons au plus tard le {{due}}.",
    outro:
      "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.",
  },
};

const OUTCOME: Record<L, Record<"done" | "rejected", string>> = {
  en: { done: "is complete", rejected: "was declined" },
  fr: { done: "est traitée", rejected: "a été refusée" },
};

const CLOSED: Record<L, Record<"subject" | "heading" | "outro", string>> = {
  en: {
    subject: "Your request #{{id}} {{outcome}}",
    heading: "Your request #{{id}} {{outcome}}.",
    outro: "Reference #{{id}}.",
  },
  fr: {
    subject: "Votre demande n° {{id}} {{outcome}}",
    heading: "Votre demande n° {{id}} {{outcome}}.",
    outro: "Référence n° {{id}}.",
  },
};

const fetchDataRequestStrings: FetchStrings = (env) =>
  fetchEmailStrings<Strings>(
    env,
    "{ dataRequestReceipt{enabled,copySupport,subject,heading,intro,outro}, dataRequestClosed{enabled,copySupport,subject,heading,intro,outro}, supportEmail, bccAll }",
  );

const formatDue = (iso: string, l: L) =>
  new Intl.DateTimeFormat(l === "fr" ? "fr-FR" : "en-GB", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(iso));

/** The receipt — sent once the request is stored: the right, the reference, the due date. */
export async function sendDataRequestReceipt(
  env: MailEnv,
  {
    to,
    id,
    requestType,
    locale,
    submittedAt,
  }: {
    to: string;
    id: number;
    requestType: string;
    locale: string;
    submittedAt: string;
  },
  fetchStrings: FetchStrings = fetchDataRequestStrings,
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return false;
  const copy = await fetchStrings(env).catch(() => null);
  const g = copy?.dataRequestReceipt;
  if (g?.enabled === false) return false;
  const l = lang(locale);
  const vars = {
    id: String(id),
    right: RIGHTS[l][requestType] ?? requestType,
    due: formatDue(dueAt(submittedAt), l),
  };
  const text = (k: keyof (typeof RECEIPT)["en"]) =>
    fill(pick(g?.[k], l) || RECEIPT[l][k], vars);
  const [subject, heading, intro, outro] = [
    text("subject"),
    text("heading"),
    text("intro"),
    text("outro"),
  ];
  const foot = supportFooter(copy?.supportEmail, l);
  await resend(env, {
    to,
    subject,
    html: `${para(heading)}${para(intro)}${para(outro)}${foot.html}`,
    text: `${heading}\n\n${intro}\n\n${outro}${foot.text}`,
    bcc: copy?.bccAll,
    supportCopy: supportCopyOf(g, copy?.supportEmail),
  });
  return true;
}

/** The closing email — the operator's note, framed by the outcome and the reference. */
export async function sendDataRequestClosedEmail(
  env: MailEnv,
  {
    to,
    id,
    outcome,
    note,
    locale,
  }: {
    to: string;
    id: number;
    outcome: "done" | "rejected";
    note: string;
    locale: string;
  },
  fetchStrings: FetchStrings = fetchDataRequestStrings,
): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return false;
  const copy = await fetchStrings(env).catch(() => null);
  const g = copy?.dataRequestClosed;
  if (g?.enabled === false) return false;
  const l = lang(locale);
  const vars = { id: String(id), outcome: OUTCOME[l][outcome] };
  const subject = fill(pick(g?.subject, l) || CLOSED[l].subject, vars);
  const heading = fill(pick(g?.heading, l) || CLOSED[l].heading, vars);
  const intro = pick(g?.intro, l);
  const lead = intro ? fill(intro, vars) : "";
  const outro = fill(pick(g?.outro, l) || CLOSED[l].outro, vars);
  const foot = supportFooter(copy?.supportEmail, l);
  await resend(env, {
    to,
    subject,
    html: `${para(heading)}${lead ? para(lead) : ""}${para(note)}${para(outro)}${foot.html}`,
    text: `${heading}\n\n${lead ? `${lead}\n\n` : ""}${note}\n\n${outro}${foot.text}`,
    bcc: copy?.bccAll,
    supportCopy: supportCopyOf(g, copy?.supportEmail),
  });
  return true;
}
