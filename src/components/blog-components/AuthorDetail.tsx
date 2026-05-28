import Image from "next/image";
import type { Locale } from "@/config";
import type { Author, PostListItem } from "@/sanity/types";
import { BlogCard } from "./BlogCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

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
      className="pt-28 pb-14 md:pt-40 md:pb-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-(--gutter) md:gap-16">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
        <header className="bg-card ring-border/60 flex flex-col items-start gap-7 rounded-xl p-8 shadow-sm ring-1 sm:flex-row sm:items-center md:p-10">
          {author.image?.asset?.url ? (
            <Image
              src={author.image.asset.url}
              alt={author.name ?? ""}
              width={240}
              height={240}
              className="h-40 w-40 rounded-full object-cover sm:h-48 sm:w-48 md:h-56 md:w-56"
              priority
            />
          ) : (
            <span
              aria-hidden="true"
              className="bg-muted flex h-40 w-40 items-center justify-center rounded-full text-5xl sm:h-48 sm:w-48 md:h-56 md:w-56"
            >
              {(author.name ?? "?").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium">
                {postCountLabel}
              </span>
              <h1 id="author-detail-title" className="text-4xl font-semibold lg:text-6xl">
                {author.name}
              </h1>
              {author.position ? (
                <p className="text-muted-foreground text-base">{author.position}</p>
              ) : null}
            </div>
            {author.bio ? (
              <p className="text-muted-foreground max-w-2xl text-lg">{author.bio}</p>
            ) : null}
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
