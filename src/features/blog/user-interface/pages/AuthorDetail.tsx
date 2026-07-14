import Image from "next/image";
import type { Locale } from "@/config";
import type { Author, PostListItem } from "@/features/blog/sanity/types";
import { BlogCard } from "@/features/blog/user-interface/components/BlogCard";
import {
  Breadcrumbs,
  type Crumb,
} from "@/features/blog/user-interface/components/Breadcrumbs";

/**
 * Author detail section — `/author/[slug]`. Hero block shows the
 * portrait + bio; below it, every published post by this author in the
 * current locale.
 */
export function AuthorDetail({
  author,
  posts,
  locale,
  breadcrumbs,
  breadcrumbsLabel,
  postsLabel,
  noPostsLabel,
}: {
  author: Author;
  posts: PostListItem[];
  locale: Locale;
  breadcrumbs: Crumb[];
  breadcrumbsLabel: string;
  postsLabel?: string;
  noPostsLabel: string;
}) {
  const postCount = posts.length;
  const postCountLabel = postsLabel
    ? postsLabel.replace("{count}", String(postCount))
    : String(postCount);
  return (
    <section
      aria-labelledby="author-detail-title"
      className="pt-6 pb-12 md:pt-8 md:pb-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-12">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <header className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {author.image?.asset?.url ? (
            <Image
              src={author.image.asset.url}
              alt={author.name ?? ""}
              width={160}
              height={160}
              className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32 md:h-40 md:w-40"
              priority
            />
          ) : (
            <span
              aria-hidden="true"
              className="bg-muted flex h-28 w-28 items-center justify-center rounded-full text-3xl sm:h-32 sm:w-32 md:h-40 md:w-40"
            >
              {(author.name ?? "?").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="flex flex-col gap-2">
            <h1 id="author-detail-title" className="text-3xl font-semibold md:text-4xl">
              {author.name}
            </h1>
            {author.position ? (
              <p className="text-muted-foreground text-sm">{author.position}</p>
            ) : null}
            {author.bio ? (
              <p className="text-muted-foreground max-w-2xl text-balance">{author.bio}</p>
            ) : null}
            <span className="text-muted-foreground mt-1 text-xs">{postCountLabel}</span>
          </div>
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">{noPostsLabel}</p>
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
