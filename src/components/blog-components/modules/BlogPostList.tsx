import Image from "next/image";
import type { BlogPostListModule, PostListItem } from "@/sanity/types";
import type { Locale } from "@/config";
import { Link } from "@/i18n/routing";
import { sanityFetchLive } from "@/sanity/live";
import { moduleBlogPostListQuery } from "@/sanity/queries";

/**
 * Server component — fetches its own posts using the module's filters
 * (categories / limit / featured) and renders them as a card grid.
 *
 * Adds `data-search-title` to each card so a `module.search` in the
 * same page can hide/show them client-side.
 */
export async function BlogPostList({
  module: m,
  locale,
}: {
  module: BlogPostListModule;
  locale: Locale;
}) {
  const categoryIds = (m.categories ?? []).map((c) => c._id).filter(Boolean);
  const posts = await sanityFetchLive<PostListItem[]>({
    query: moduleBlogPostListQuery,
    params: {
      locale,
      categoryIds,
      limit: m.limit ?? 100,
      featuredOnly: m.featuredOnly ?? false,
    },
  });

  return (
    <section id={m.anchor} className="mx-auto max-w-6xl px-(--gutter) py-12 md:py-20">
      {m.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{m.title}</h2>
          {m.intro ? <p className="text-muted-foreground mt-3">{m.intro}</p> : null}
        </header>
      ) : null}

      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-12 text-center">No posts yet.</p>
      ) : (
        <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <PostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PostCard({ post, locale }: { post: PostListItem; locale: Locale }) {
  const image = post.metadata?.image?.asset?.url;
  const category = post.categories?.[0]?.title;
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;
  const slug = post.slug ?? "";
  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description;

  return (
    <article
      data-search-title={title}
      className="bg-card ring-border/60 group flex h-full flex-col overflow-hidden rounded-xl shadow-sm ring-1 transition hover:shadow-md"
    >
      <Link
        href={`/blog/${slug}`}
        className="focus-visible:ring-ring relative block aspect-[4/3] overflow-hidden focus-visible:ring-2 focus-visible:outline-none"
      >
        {image ? (
          <Image
            src={image}
            alt={post.metadata?.image?.alt ?? title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="bg-muted h-full w-full" aria-hidden="true" />
        )}
        {category ? (
          <span className="bg-background/90 text-foreground absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-medium">
            {category}
          </span>
        ) : null}
        {post.featured ? (
          <span className="bg-brand text-brand-foreground absolute top-3 right-3 rounded-md px-2 py-1 text-xs font-medium">
            ★
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link
          href={`/blog/${slug}`}
          className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
        >
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>
        {description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
        ) : null}
        <div className="text-muted-foreground mt-auto flex items-center justify-between pt-3 text-xs">
          {post.author?.name ? <span>{post.author.name}</span> : <span />}
          {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
        </div>
      </div>
    </article>
  );
}
