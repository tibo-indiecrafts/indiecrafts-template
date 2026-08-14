import { NextResponse } from "next/server";
import { defaultLocale, features, site } from "@indiecrafts/config";
import { projectId } from "@indiecrafts/sanity/env";
import { logger } from "@indiecrafts/logger";
import {
  renderCommentNotificationEmail,
  renderNewsletterConfirmEmail,
  renderNewsletterNotificationEmail,
  renderWaitlistConfirmEmail,
  renderWaitlistNotificationEmail,
  sendEmail,
  type RenderedEmail,
} from "@indiecrafts/email";
import { getEmailStrings, pick } from "@indiecrafts/email/strings";

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

  let body: { to?: unknown };
  try {
    body = (await request.json()) as { to?: unknown };
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
async function buildSamples(to: string): Promise<Sample[]> {
  const strings = await getEmailStrings();
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
      }),
    });
  }

  return samples;
}
