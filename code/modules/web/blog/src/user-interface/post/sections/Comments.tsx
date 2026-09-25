/**
 * Render the approved comment thread and the comment form under a post.
 *
 * @see docs/reference/modules/web/blog/src/user-interface/post/sections/Comments.md
 */
import type { Locale } from "@indiecrafts/packages-shared-config";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { approvedCommentsQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import type {
  Comment,
  CommentsCopy,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { localized } from "@indiecrafts/modules-web-blog/lib/localize";
import { CommentForm } from "@indiecrafts/modules-web-blog/user-interface/post/components/CommentForm";
import { CommentReply } from "@indiecrafts/modules-web-blog/user-interface/post/components/CommentReply";

/**
 * Comment section under a post — the approved list (1-level threaded) + the
 * form. All copy comes from the editable `blog.comments` object, resolved for
 * the active locale; the English strings below are last-resort fallbacks for a
 * not-yet-filled field (the seed populates real bilingual copy).
 */
export async function Comments({
  postId,
  locale,
  copy,
}: {
  postId: string;
  locale: Locale;
  copy?: CommentsCopy;
}) {
  const comments = await sanityFetchLive<Comment[]>({
    query: approvedCommentsQuery,
    params: { postId },
  });

  // 1-level threading: top-level comments + replies grouped by parent.
  const roots = comments.filter((c) => !c.parentId);
  const repliesByParent = new Map<string, Comment[]>();
  for (const c of comments) {
    if (c.parentId) {
      const list = repliesByParent.get(c.parentId) ?? [];
      list.push(c);
      repliesByParent.set(c.parentId, list);
    }
  }

  // Resolve the editable copy once; passed as plain strings to the client bits.
  const labels = {
    nameLabel: localized(copy?.nameLabel, locale, "Name"),
    emailLabel: localized(copy?.emailLabel, locale, "Email (optional)"),
    bodyLabel: localized(copy?.bodyLabel, locale, "Comment"),
    consentLabel: localized(
      copy?.consentLabel,
      locale,
      "I agree my name and comment can be stored and shown here.",
    ),
    submitLabel: localized(copy?.submitLabel, locale, "Post comment"),
    successMessage: localized(
      copy?.successMessage,
      locale,
      "Thanks — your comment is awaiting review.",
    ),
    errorMessage: localized(
      copy?.errorMessage,
      locale,
      "Something went wrong. Please try again.",
    ),
  };
  const replyLabel = localized(copy?.replyLabel, locale, "Reply");
  const cancelLabel = localized(copy?.cancelLabel, locale, "Cancel");

  function Item({ c }: { c: Comment }) {
    return (
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium"
        >
          {(c.authorName ?? "?").slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline gap-2 text-sm">
            <span className="font-medium">{c.authorName}</span>
            {c.createdAt ? (
              <time
                dateTime={c.createdAt}
                className="text-muted-foreground text-xs"
              >
                {formatDate(locale, c.createdAt)}
              </time>
            ) : null}
          </p>
          <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
            {c.body}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="comments-title"
      className="border-border/60 mx-auto max-w-3xl border-t px-(--gutter) py-12 md:py-16"
    >
      <h2 id="comments-title" className="text-2xl font-semibold tracking-tight">
        {localized(copy?.heading, locale, "Comments")}
        {comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>

      {roots.length > 0 ? (
        <ul className="mt-8 space-y-8">
          {roots.map((root) => {
            const replies = repliesByParent.get(root._id) ?? [];
            return (
              <li key={root._id}>
                <Item c={root} />
                {replies.length > 0 ? (
                  <ul className="border-border/60 mt-4 ml-4 space-y-4 border-l pl-5">
                    {replies.map((r) => (
                      <li key={r._id}>
                        <Item c={r} />
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="ml-12">
                  <CommentReply
                    postId={postId}
                    parentId={root._id}
                    replyLabel={replyLabel}
                    cancelLabel={cancelLabel}
                    {...labels}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground mt-6 text-sm">
          {localized(
            copy?.emptyMessage,
            locale,
            "No comments yet — be the first.",
          )}
        </p>
      )}

      <div className="mt-10">
        <CommentForm postId={postId} {...labels} />
      </div>
    </section>
  );
}
