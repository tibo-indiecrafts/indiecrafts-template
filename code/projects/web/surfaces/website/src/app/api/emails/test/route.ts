/**
 * Send a sample of every enabled email to a chosen address.
 *
 * @see docs/reference/projects/web/website/src/app/api/emails/test/route.md
 */
import { NextResponse } from "next/server";
import { defaultLocale, features, site } from "@/config";
import { projectId } from "@indiecrafts/packages-web-sanity/env";
import { logger } from "@indiecrafts/packages-shared-logger";
import { sendEmail, type RenderedEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type ConfirmationConfig,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";
// Templates now live with their owning feature — the aggregator (the app) is the
// one place allowed to reach into every module, like `sanity.config.ts`.
import { renderCommentNotificationEmail } from "@indiecrafts/modules-web-blog/emails/comment-notification";
import { renderNewsletterConfirmEmail } from "@indiecrafts/modules-web-newsletter/emails/newsletter-confirm";
import { renderNewsletterNotificationEmail } from "@indiecrafts/modules-web-newsletter/emails/newsletter-notification";
import { renderWaitlistConfirmEmail } from "@indiecrafts/modules-web-waitlist/emails/waitlist-confirm";
import { renderWaitlistNotificationEmail } from "@indiecrafts/modules-web-waitlist/emails/waitlist-notification";
import { renderContactConfirmEmail } from "@indiecrafts/modules-web-contact/emails/contact-confirm";
import { renderContactNotificationEmail } from "@indiecrafts/modules-web-contact/emails/contact-notification";
import { renderLeadMagnetEmail } from "@indiecrafts/modules-web-newsletter/emails/lead-magnet";
import { renderDataRequestNotificationEmail } from "@indiecrafts/packages-web-compliance/emails/data-request-notification";
import { adminReviewUrl } from "@indiecrafts/packages-web-compliance/requests/submit";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Studio "Send test" endpoint — sends a sample of every **enabled** email to a
 * chosen address so an editor can verify deliverability (does mail leave the
 * server, does it land, does the branded layout render).
 *
 * **Not public.** Gated by `features.studio`, then the caller's Sanity session
 * token is verified against the project's `users/me` — only a signed-in editor
 * of THIS project can trigger a send, so it can't be abused as a spam relay. The
 * `RESEND_API_KEY` secret stays server-side; test sends go **only** to the given
 * address (real BCC recipients are exercised by real signups, not test clicks).
 */
export async function POST(request: Request) {
  if (!features.studio) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!(await isProjectUser(token))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY manquant côté serveur." },
      { status: 503 },
    );
  }

  // Body is a single `{ to }` — cap it so this authenticated route can't be fed
  // an oversized payload (the public routes get this from `withGuard`).
  if (Number(request.headers.get("content-length") ?? 0) > 2000) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }
  let body: { to?: unknown };
  try {
    // Re-check actual bytes — the content-length header alone can be missing or lying.
    const text = await request.text();
    if (new TextEncoder().encode(text).length > 2000)
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    body = JSON.parse(text) as { to?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const to = String(body.to ?? "").trim();
  if (!EMAIL.test(to)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }

  const samples = await buildSamples(to);
  const results = await Promise.all(
    samples.map(async ({ label, from, message }) => {
      try {
        await sendEmail({ from, to: [to], ...message });
        return { label, ok: true };
      } catch (error) {
        logger.error("email test send failed", { label, error });
        return { label, ok: false };
      }
    }),
  );

  return NextResponse.json({ results });
}

/** True only if `token` belongs to a member of THIS Sanity project (auth + authz in one call). */
async function isProjectUser(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`https://${projectId}.api.sanity.io/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const user = (await res.json()) as { id?: string };
    return Boolean(user?.id);
  } catch (error) {
    logger.error("email test auth check failed", { error });
    return false;
  }
}

type Sample = { label: string; from: string; message: RenderedEmail };

/** One rendered sample per enabled email (configured copy where set, else a sensible default). */
// The aggregator narrows every group at once (it renders them all) — the one
// place that names each feature's group, which is fine here (it is the app).
type EmailConfig = {
  commentNotification?: OwnerAlertConfig;
  newsletterConfirm?: ConfirmationConfig;
  newsletterOwner?: OwnerAlertConfig;
  leadMagnet?: ConfirmationConfig;
  waitlistConfirm?: ConfirmationConfig;
  waitlistOwner?: OwnerAlertConfig;
  contactConfirm?: ConfirmationConfig;
  contactOwner?: OwnerAlertConfig;
  dataRequestOwner?: OwnerAlertConfig;
};

async function buildSamples(to: string): Promise<Sample[]> {
  const strings = (await getEmailStrings()) as EmailConfig | null;
  const locale = defaultLocale;
  const studioUrl = `${site.url}/studio`;
  const samples: Sample[] = [];

  const comment = strings?.commentNotification;
  if (comment?.enabled && comment.from?.trim()) {
    samples.push({
      label: "commentNotification",
      from: comment.from.trim(),
      message: renderCommentNotificationEmail({
        author: "Jean Test",
        authorEmail: to,
        postTitle: "Article de démonstration",
        postUrl: `${site.url}/blog`,
        studioUrl,
        excerpt:
          "Ceci est un commentaire de test — vérification de l'e-mail de modération.",
        subjectTemplate: comment.subject ?? undefined,
        heading: pick(comment.heading, locale) || undefined,
        intro: pick(comment.intro, locale) || undefined,
        outro: pick(comment.outro, locale) || undefined,
      }),
    });
  }

  const nlConfirm = strings?.newsletterConfirm;
  if (nlConfirm?.enabled && nlConfirm.from?.trim()) {
    samples.push({
      label: "newsletterConfirm",
      from: nlConfirm.from.trim(),
      message: renderNewsletterConfirmEmail({
        subject: pick(nlConfirm.subject, locale) || "Confirmez votre inscription",
        heading: pick(nlConfirm.heading, locale) || "Plus qu'une étape",
        intro: pick(nlConfirm.intro, locale) || "Ceci est un e-mail de test.",
        buttonLabel: pick(nlConfirm.buttonLabel, locale) || "Confirmer mon inscription",
        confirmUrl: `${site.url}/api/newsletter/confirm?token=TEST`,
        outro: pick(nlConfirm.outro, locale) || undefined,
      }),
    });
  }

  const nlOwner = strings?.newsletterOwner;
  if (nlOwner?.enabled && nlOwner.from?.trim()) {
    samples.push({
      label: "newsletterOwner",
      from: nlOwner.from.trim(),
      message: renderNewsletterNotificationEmail({
        subscriberEmail: to,
        source: "test",
        studioUrl,
        subjectTemplate: nlOwner.subject ?? undefined,
        heading: pick(nlOwner.heading, locale) || undefined,
        intro: pick(nlOwner.intro, locale) || undefined,
        outro: pick(nlOwner.outro, locale) || undefined,
      }),
    });
  }

  const lead = strings?.leadMagnet;
  const leadFrom = lead?.from?.trim() || nlConfirm?.from?.trim();
  if (leadFrom) {
    samples.push({
      label: "leadMagnet",
      from: leadFrom,
      message: renderLeadMagnetEmail({
        subject: pick(lead?.subject, locale) || "Votre document est prêt",
        heading: pick(lead?.heading, locale) || "Merci — voici votre document",
        intro: (
          pick(lead?.intro, locale) || "Ceci est un e-mail de test. {{title}}"
        ).replaceAll("{{title}}", "Document de démonstration"),
        buttonLabel: pick(lead?.buttonLabel, locale) || "Télécharger le document",
        downloadUrl: `${site.url}/api/download?token=TEST`,
        outro: pick(lead?.outro, locale) || undefined,
      }),
    });
  }

  const wlConfirm = strings?.waitlistConfirm;
  if (wlConfirm?.enabled && wlConfirm.from?.trim()) {
    samples.push({
      label: "waitlistConfirm",
      from: wlConfirm.from.trim(),
      message: renderWaitlistConfirmEmail({
        subject: pick(wlConfirm.subject, locale) || "Vous êtes sur la liste d'attente",
        heading: pick(wlConfirm.heading, locale) || "Bienvenue sur la liste",
        intro: pick(wlConfirm.intro, locale) || "Ceci est un e-mail de test.",
        outro: pick(wlConfirm.outro, locale) || undefined,
      }),
    });
  }

  const wlOwner = strings?.waitlistOwner;
  if (wlOwner?.enabled && wlOwner.from?.trim()) {
    samples.push({
      label: "waitlistOwner",
      from: wlOwner.from.trim(),
      message: renderWaitlistNotificationEmail({
        email: to,
        name: "Test",
        source: "test",
        studioUrl,
        subjectTemplate: wlOwner.subject ?? undefined,
        heading: pick(wlOwner.heading, locale) || undefined,
        intro: pick(wlOwner.intro, locale) || undefined,
        outro: pick(wlOwner.outro, locale) || undefined,
      }),
    });
  }

  const ctConfirm = strings?.contactConfirm;
  if (ctConfirm?.enabled && ctConfirm.from?.trim()) {
    samples.push({
      label: "contactConfirm",
      from: ctConfirm.from.trim(),
      message: renderContactConfirmEmail({
        subject: pick(ctConfirm.subject, locale) || "Nous avons bien reçu votre message",
        heading: pick(ctConfirm.heading, locale) || "Merci de nous avoir écrit",
        intro: pick(ctConfirm.intro, locale) || "Ceci est un e-mail de test.",
        outro: pick(ctConfirm.outro, locale) || undefined,
      }),
    });
  }

  const ctOwner = strings?.contactOwner;
  if (ctOwner?.enabled && ctOwner.from?.trim()) {
    samples.push({
      label: "contactOwner",
      from: ctOwner.from.trim(),
      message: renderContactNotificationEmail({
        email: to,
        name: "Test",
        subject: "Message de démonstration",
        message: "Ceci est un e-mail de test — vérification de l'alerte contact.",
        source: "test",
        studioUrl,
        subjectTemplate: ctOwner.subject ?? undefined,
        heading: pick(ctOwner.heading, locale) || undefined,
        intro: pick(ctOwner.intro, locale) || undefined,
        outro: pick(ctOwner.outro, locale) || undefined,
      }),
    });
  }

  const drOwner = strings?.dataRequestOwner;
  if (drOwner?.enabled && drOwner.from?.trim()) {
    samples.push({
      label: "dataRequestOwner",
      from: drOwner.from.trim(),
      message: renderDataRequestNotificationEmail({
        requestTypeLabel: "Effacement",
        email: to,
        message: "Ceci est un e-mail de test.",
        source: "test",
        reviewUrl: adminReviewUrl(),
        subjectTemplate: drOwner.subject ?? undefined,
        heading: pick(drOwner.heading, locale) || undefined,
        intro: pick(drOwner.intro, locale) || undefined,
        outro: pick(drOwner.outro, locale) || undefined,
      }),
    });
  }

  return samples;
}
