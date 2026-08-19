import "server-only";

import { defineQuery } from "next-sanity";
import { site, defaultLocale } from "@indiecrafts/config";
import { client } from "@indiecrafts/sanity/client";
import { logger } from "@indiecrafts/logger";
import { sendEmail } from "@indiecrafts/email";
import {
  getEmailStrings,
  pick,
  type OwnerAlertConfig,
} from "@indiecrafts/email/strings";
import { renderCommentNotificationEmail } from "../emails/comment-notification";
import type { CommentInput } from "./comments";

const postQuery = defineQuery(
  `*[_type == "post" && _id == $id][0]{ title, "slug": slug.current }`,
);

const clean = (list?: string[] | null) =>
  (list ?? []).map((s) => s.trim()).filter(Boolean);

/**
 * Best-effort email to the site owner when a comment is submitted. **Never
 * throws** — a mail failure must not fail an already-saved comment. Config +
 * copy live on the shared `emailStrings` entity (Studio → E-mails →
 * commentNotification); `@indiecrafts/email` owns the layout.
 */
export async function notifyNewComment(
  input: CommentInput,
  moderationToken?: string,
): Promise<void> {
  try {
    const cfg = (
      (await getEmailStrings()) as {
        commentNotification?: OwnerAlertConfig;
      } | null
    )?.commentNotification;
    const to = clean(cfg?.to);
    if (!cfg?.enabled || to.length === 0 || !process.env.RESEND_API_KEY) return;

    const from = cfg.from?.trim();
    if (!from) {
      logger.error("comment notification skipped: no `from` configured");
      return;
    }

    const post = (await client.fetch(postQuery, { id: input.postId })) as {
      title?: string | null;
      slug?: string | null;
    } | null;
    const postTitle = post?.title ?? "un article";
    const postUrl = post?.slug ? `${site.url}/blog/${post.slug}` : site.url;

    const body = input.body.trim();
    const excerpt = body.length > 500 ? `${body.slice(0, 500)}…` : body;
    const authorEmail = input.authorEmail?.trim();

    // One-click moderation buttons — default on; each opens a confirm page.
    const actions =
      cfg.moderationButtons !== false && moderationToken
        ? {
            approveUrl: `${site.url}/api/comments/moderate?token=${moderationToken}&action=approve`,
            spamUrl: `${site.url}/api/comments/moderate?token=${moderationToken}&action=spam`,
            deleteUrl: `${site.url}/api/comments/moderate?token=${moderationToken}&action=delete`,
          }
        : undefined;

    const message = renderCommentNotificationEmail({
      author: input.authorName.trim(),
      authorEmail,
      postTitle,
      postUrl,
      studioUrl: `${site.url}/studio`,
      excerpt,
      subjectTemplate: cfg.subject ?? undefined,
      heading: pick(cfg.heading, defaultLocale) || undefined,
      intro: pick(cfg.intro, defaultLocale) || undefined,
      outro: pick(cfg.outro, defaultLocale) || undefined,
      actions,
    });

    await sendEmail({
      from,
      to,
      cc: clean(cfg.cc),
      bcc: clean(cfg.bcc),
      replyTo: cfg.replyTo?.trim() || authorEmail,
      ...message,
    });
  } catch (error) {
    logger.error("comment notification failed", {
      postId: input.postId,
      error,
    });
  }
}
