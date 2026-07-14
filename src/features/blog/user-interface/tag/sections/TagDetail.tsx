import type { Locale } from "@/config";
import type { PostListItem, Tag } from "@/features/blog/sanity/types";
import { BlogCard } from "@/features/blog/user-interface/shared/components/BlogCard";
import {
  Breadcrumbs,
  type Crumb,
} from "@/features/blog/user-interface/shared/components/Breadcrumbs";

/**
 * Tag detail section — `/blog/tag/[slug]`. Header card shows the tag
 * label + post count + description. Below: every post carrying this
 * tag, locale-filtered.
 */
export function TagDetail({
  tag,
  posts,
  locale,
  breadcrumbs,
  breadcrumbsLabel,
  postsLabel,
  noPostsLabel,
}: {
  tag: Tag;
  posts: PostListItem[];
  locale: Locale;
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  postsLabel?: string;
  noPostsLabel: string;
}) {
  const count = tag.postCount ?? posts.length;
  const countLabel = postsLabel
    ? postsLabel.replace("{count}", String(count))
    : String(count);

  return (
    <section aria-labelledby="tag-detail-title" className="pt-6 pb-12 md:pt-8 md:pb-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />

        <header className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs">{countLabel}</span>
          <h1
            id="tag-detail-title"
            className="text-3xl font-semibold capitalize md:text-4xl"
          >
            #{tag.title}
          </h1>
          {tag.description ? (
            <p className="text-muted-foreground max-w-2xl text-balance">
              {tag.description}
            </p>
          ) : null}
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center">{noPostsLabel}</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post._id}>
                <BlogCard post={post} locale={locale} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
