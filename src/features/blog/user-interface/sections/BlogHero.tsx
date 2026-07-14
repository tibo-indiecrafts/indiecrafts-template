import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/config";
import { formatPostDate } from "@/lib/format-date";
import type { PostListItem } from "@/features/blog/sanity/types";

/**
 * Five-card hero — mirrors the blog-forge home grid. First two cards
 * are tall (h-[400px]), bottom three short (h-[245px]); first card
 * spans 2 columns on md+ to form the "feature post" emphasis.
 *
 * Server component — accepts the posts prefetched by the route.
 */
export function BlogHero({
  posts,
  locale,
  label,
}: {
  posts: PostListItem[];
  locale: Locale;
  label: string;
}) {
  if (!posts.length) return null;
  const top = posts.slice(0, 5);

  return (
    <section aria-label={label} className="bg-muted/40 pt-24 pb-14 md:pt-28 md:pb-20">
      <div className="mx-auto max-w-6xl px-(--gutter)">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {top.map((post, i) => (
            <HeroCard
              key={post._id}
              post={post}
              locale={locale}
              span={i === 0 ? "md:col-span-2" : "md:col-span-1"}
              height={i < 2 ? "h-[400px]" : "h-[245px]"}
              size={i < 2 ? "lg" : "sm"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroCard({
  post,
  locale,
  span,
  height,
  size,
}: {
  post: PostListItem;
  locale: Locale;
  span: string;
  height: string;
  size: "lg" | "sm";
}) {
  const slug = post.slug ?? "";
  const image = post.metadata?.image?.asset?.url;
  const alt = post.metadata?.image?.alt;
  const title = post.metadata?.title ?? post.title ?? "";
  const categoryRef = post.categories?.[0];
  const category = categoryRef?.title;
  const categorySlug = categoryRef?.slug;
  const author = post.author;
  const date = formatPostDate(locale, post.publishedAt);

  return (
    <article
      className={`group relative overflow-hidden rounded-xl transition hover:shadow-lg ${span} ${height}`}
    >
      {image ? (
        <Image
          src={image}
          alt={alt ?? title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="absolute inset-0 z-0 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={size === "lg"}
        />
      ) : (
        <div className="bg-muted absolute inset-0" aria-hidden="true" />
      )}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-black/20" />

      {author ? (
        <Link
          href={author.slug ? `/author/${author.slug}` : "/author"}
          aria-label={author.name ?? undefined}
          className="absolute top-5 left-5 z-20 block"
        >
          {author.image?.asset?.url ? (
            <Image
              src={author.image.asset.url}
              alt={author.name ?? ""}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/80"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xs font-medium text-black ring-2 ring-white/80">
              {(author.name ?? "?").slice(0, 1).toUpperCase()}
            </span>
          )}
        </Link>
      ) : null}

      {category ? (
        categorySlug ? (
          <Link
            href={`/blog/category/${categorySlug}`}
            className="bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:ring-ring absolute top-5 right-5 z-20 rounded-md px-3 py-1 text-xs font-semibold capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {category}
          </Link>
        ) : (
          <span className="bg-brand text-brand-foreground absolute top-5 right-5 z-20 rounded-md px-3 py-1 text-xs font-semibold capitalize">
            {category}
          </span>
        )
      ) : null}

      <div className="absolute right-5 bottom-5 left-5 z-20 text-white">
        <Link
          href={`/blog/${slug}`}
          className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {size === "lg" ? (
            <h2 className="mb-4 line-clamp-2 text-2xl font-semibold md:text-3xl">
              {title}
            </h2>
          ) : (
            <h3 className="mb-3 line-clamp-2 text-lg font-semibold">{title}</h3>
          )}
        </Link>
        <div className="flex items-center justify-between text-xs">
          {author?.name ? <span className="truncate">{author.name}</span> : <span />}
          {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
        </div>
      </div>
    </article>
  );
}
