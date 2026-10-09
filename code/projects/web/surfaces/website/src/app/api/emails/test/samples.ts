/**
 * Render the website's email samples for the Studio test: owner alerts once, visitor emails per locale.
 *
 * @see docs/reference/projects/web/website/src/app/api/emails/test/samples.md
 */
import { defaultLocale, site, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import type { RenderedEmail } from "@indiecrafts/packages-web-email";
import {
  getEmailStrings,
  pick,
  type ConfirmationConfig,
  type OwnerAlertConfig,
} from "@indiecrafts/packages-web-email/strings";
// Templates now live with their owning feature — the aggregator (the app) is the
// one place allowed to reach into every module, like `sanity.config.ts`.
import { renderCommentNotificationEmail } from "@indiecrafts/modules-web-blog/emails/comment-notification";
import {
  confirmEmailDefaults,
  renderNewsletterConfirmEmail,
} from "@indiecrafts/modules-web-newsletter/emails/newsletter-confirm";
import { renderNewsletterNotificationEmail } from "@indiecrafts/modules-web-newsletter/emails/newsletter-notification";
import {
  renderWaitlistConfirmEmail,
  waitlistConfirmDefaults,
} from "@indiecrafts/modules-web-waitlist/emails/waitlist-confirm";
import { renderWaitlistNotificationEmail } from "@indiecrafts/modules-web-waitlist/emails/waitlist-notification";
import {
  contactConfirmDefaults,
  renderContactConfirmEmail,
} from "@indiecrafts/modules-web-contact/emails/contact-confirm";
import { renderContactNotificationEmail } from "@indiecrafts/modules-web-contact/emails/contact-notification";
import {
  leadMagnetDefaults,
  renderLeadMagnetEmail,
} from "@indiecrafts/modules-web-newsletter/emails/lead-magnet";
import { renderDataRequestNotificationEmail } from "@indiecrafts/packages-web-compliance/emails/data-request-notification";
import { adminReviewUrl } from "@indiecrafts/packages-web-compliance/requests/submit";
import { requestTypeLabel } from "@indiecrafts/packages-web-compliance/requests/request-types";

export type Sample = { label: string; from: string; message: RenderedEmail };

/** One rendered sample per enabled email (configured copy where set, else a sensible default). */
// The aggregator narrows every group at once (it renders them all) — the one
// place that names each feature's group, which is fine here (it is the app).
type EmailConfig = {
  commentNotification?: OwnerAlertConfig;
  newsletterConfirm?: ConfirmationConfig;
  leadMagnetConfirm?: ConfirmationConfig;
  newsletterOwner?: OwnerAlertConfig;
  leadMagnet?: ConfirmationConfig;
  waitlistConfirm?: ConfirmationConfig;
  waitlistOwner?: OwnerAlertConfig;
  contactConfirm?: ConfirmationConfig;
  contactOwner?: OwnerAlertConfig;
  dataRequestOwner?: OwnerAlertConfig;
  supportEmail?: string;
};

/**
 * The samples, as the real emails go out: an owner alert once, in the default locale;
 * a visitor email once per site locale, labelled `<group> · <locale>`. Every sample
 * carries the support line, as every real email does.
 */
export async function buildSamples(
  to: string,
  locales: readonly Locale[],
): Promise<Sample[]> {
  const strings = (await getEmailStrings()) as EmailConfig | null;
  return [
    ...ownerSamples(strings, to),
    ...locales.flatMap((locale) =>
      visitorSamples(strings, locale).map((sample) => ({
        ...sample,
        label: `${sample.label} · ${locale}`,
      })),
    ),
  ];
}

/** The internal alerts to the site team — sent in the site's default locale. */
function ownerSamples(strings: EmailConfig | null, to: string): Sample[] {
  const locale = defaultLocale;
  const supportEmail = strings?.supportEmail;
  const studioUrl = `${site.url}/studio`;
  const copy = (cfg: OwnerAlertConfig | undefined) => ({
    subjectTemplate: cfg?.subject ?? undefined,
    heading: pick(cfg?.heading, locale) || undefined,
    intro: pick(cfg?.intro, locale) || undefined,
    outro: pick(cfg?.outro, locale) || undefined,
    supportEmail,
  });
  const samples: Sample[] = [];

  const comment = strings?.commentNotification;
  if (comment?.enabled && comment.from?.trim()) {
    samples.push({
      label: "commentNotification",
      from: comment.from.trim(),
      message: renderCommentNotificationEmail({
        locale,
        author: "Test Author",
        authorEmail: to,
        postTitle: "Demo post",
        postUrl: `${site.url}/blog`,
        studioUrl,
        excerpt: "This is a test comment — checking the moderation email.",
        ...copy(comment),
      }),
    });
  }

  const nlOwner = strings?.newsletterOwner;
  if (nlOwner?.enabled && nlOwner.from?.trim()) {
    samples.push({
      label: "newsletterOwner",
      from: nlOwner.from.trim(),
      message: renderNewsletterNotificationEmail({
        locale,
        subscriberEmail: to,
        subscriberLocale: locale,
        source: "test",
        ...copy(nlOwner),
      }),
    });
  }

  const wlOwner = strings?.waitlistOwner;
  if (wlOwner?.enabled && wlOwner.from?.trim()) {
    samples.push({
      label: "waitlistOwner",
      from: wlOwner.from.trim(),
      message: renderWaitlistNotificationEmail({
        locale,
        email: to,
        name: "Test",
        source: "test",
        studioUrl,
        ...copy(wlOwner),
      }),
    });
  }

  const ctOwner = strings?.contactOwner;
  if (ctOwner?.enabled && ctOwner.from?.trim()) {
    samples.push({
      label: "contactOwner",
      from: ctOwner.from.trim(),
      message: renderContactNotificationEmail({
        locale,
        email: to,
        name: "Test",
        subject: "Demo message",
        message: "This is a test email — checking the contact alert.",
        source: "test",
        studioUrl,
        ...copy(ctOwner),
      }),
    });
  }

  const drOwner = strings?.dataRequestOwner;
  if (drOwner?.enabled && drOwner.from?.trim()) {
    samples.push({
      label: "dataRequestOwner",
      from: drOwner.from.trim(),
      message: renderDataRequestNotificationEmail({
        locale,
        requestTypeLabel: requestTypeLabel("erasure", locale),
        email: to,
        message: "This is a test email.",
        source: "test",
        reviewUrl: adminReviewUrl(),
        ...copy(drOwner),
      }),
    });
  }

  return samples;
}

/** The emails a visitor receives — rendered in `locale`, as a visitor on that locale gets them. */
function visitorSamples(strings: EmailConfig | null, locale: Locale): Sample[] {
  const supportEmail = strings?.supportEmail;
  const samples: Sample[] = [];
  // The real email's link: the localized confirm page (its button POSTs the token).
  const confirmUrl = `${site.url}${localizedPathname("/newsletter/confirm", locale)}#t=TEST`;

  const nlConfirm = strings?.newsletterConfirm;
  if (nlConfirm?.enabled && nlConfirm.from?.trim()) {
    const fallback = confirmEmailDefaults(locale);
    samples.push({
      label: "newsletterConfirm",
      from: nlConfirm.from.trim(),
      message: renderNewsletterConfirmEmail({
        subject: pick(nlConfirm.subject, locale) || fallback.subject,
        heading: pick(nlConfirm.heading, locale) || fallback.heading,
        intro: pick(nlConfirm.intro, locale) || fallback.intro,
        buttonLabel: pick(nlConfirm.buttonLabel, locale) || fallback.buttonLabel,
        confirmUrl,
        outro: pick(nlConfirm.outro, locale) || undefined,
        locale,
        supportEmail,
      }),
    });

    // A lead-magnet request's confirmation: the newsletter's sender + switch, its own words.
    const leadCopy = strings?.leadMagnetConfirm;
    const leadFallback = confirmEmailDefaults(locale, "lead-magnet");
    samples.push({
      label: "leadMagnetConfirm",
      from: nlConfirm.from.trim(),
      message: renderNewsletterConfirmEmail({
        subject: pick(leadCopy?.subject, locale) || leadFallback.subject,
        heading: pick(leadCopy?.heading, locale) || leadFallback.heading,
        intro: pick(leadCopy?.intro, locale) || leadFallback.intro,
        buttonLabel: pick(leadCopy?.buttonLabel, locale) || leadFallback.buttonLabel,
        confirmUrl,
        outro:
          pick(leadCopy?.outro, locale) || pick(nlConfirm.outro, locale) || undefined,
        locale,
        supportEmail,
      }),
    });
  }

  const lead = strings?.leadMagnet;
  const leadFrom = lead?.from?.trim() || nlConfirm?.from?.trim();
  if (leadFrom) {
    const title = "Demo document";
    const fallback = leadMagnetDefaults(locale, title);
    samples.push({
      label: "leadMagnet",
      from: leadFrom,
      message: renderLeadMagnetEmail({
        subject: pick(lead?.subject, locale) || fallback.subject,
        heading: pick(lead?.heading, locale) || fallback.heading,
        intro: pick(lead?.intro, locale).replaceAll("{{title}}", title) || fallback.intro,
        buttonLabel: pick(lead?.buttonLabel, locale) || fallback.buttonLabel,
        downloadUrl: `${site.url}/api/download?token=TEST`,
        outro: pick(lead?.outro, locale) || undefined,
        locale,
        supportEmail,
      }),
    });
  }

  const wlConfirm = strings?.waitlistConfirm;
  if (wlConfirm?.enabled && wlConfirm.from?.trim()) {
    const fallback = waitlistConfirmDefaults(locale, "Test");
    samples.push({
      label: "waitlistConfirm",
      from: wlConfirm.from.trim(),
      message: renderWaitlistConfirmEmail({
        subject: pick(wlConfirm.subject, locale) || fallback.subject,
        heading: pick(wlConfirm.heading, locale) || fallback.heading,
        intro: pick(wlConfirm.intro, locale) || fallback.intro,
        outro: pick(wlConfirm.outro, locale) || undefined,
        locale,
        supportEmail,
      }),
    });
  }

  const ctConfirm = strings?.contactConfirm;
  if (ctConfirm?.enabled && ctConfirm.from?.trim()) {
    const fallback = contactConfirmDefaults(locale);
    samples.push({
      label: "contactConfirm",
      from: ctConfirm.from.trim(),
      message: renderContactConfirmEmail({
        subject: pick(ctConfirm.subject, locale) || fallback.subject,
        heading: pick(ctConfirm.heading, locale) || fallback.heading,
        intro: pick(ctConfirm.intro, locale) || fallback.intro,
        outro: pick(ctConfirm.outro, locale) || undefined,
        locale,
        supportEmail,
      }),
    });
  }

  return samples;
}
