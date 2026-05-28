import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/config";
import type { PostListItem } from "@/sanity/types";

/**
 * Featured card used by the blog listing, two-column variant, category
 * explorer, and author detail. Carries the author avatar overlay + the
 * read-time / category badges from the blog-forge design.
 *
 * Read count + comment count are static placeholders — Sanity doesn't
 * track those; wire them up if/when you add an analytics or
 * commenting backend.
 */
export async function BlogCard({
  post,
  locale,
  variant = "tall",
}: {
  post: PostListItem;
  locale: Locale;
  variant?: "tall" | "wide";
}) {
  const t = await getTranslations({ locale, namespace: "pages.blog" });
  const image = post.metadata?.image?.asset?.url;
  const alt = post.metadata?.image?.alt;
  const categoryRef = post.categories?.[0];
  const category = categoryRef?.title;
  const categorySlug = categoryRef?.slug;
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
  const author = post.author;
  const aspect = variant === "wide" ? "aspect-[16/9]" : "aspect-[4/3]";

  return (
    <article
      data-search-title={title}
      className="bg-card ring-border/60 group flex h-full flex-col overflow-hidden rounded-xl shadow-sm ring-1 transition hover:scale-[1.01] hover:shadow-md"
    >
      <Link
        href={`/blog/${slug}`}
        className="focus-visible:ring-ring relative block focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className={`relative ${aspect} overflow-hidden`}>
          {image ? (
            <Image
              src={image}
              alt={alt ?? title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="bg-muted h-full w-full" aria-hidden="true" />
          )}
          {post.featured ? (
            <span
              aria-label={t("featuredLabel")}
              className="bg-brand text-brand-foreground absolute top-3 right-3 rounded-md px-2 py-1 text-xs font-medium uppercase"
            >
              ★
            </span>
          ) : null}
        </div>
      </Link>

      <div className="relative flex flex-1 flex-col gap-4 p-6 pt-8">
        {author ? (
          <Link
            href={author.slug ? `/author/${author.slug}` : "/author"}
            aria-label={author.name ?? undefined}
            className="focus-visible:ring-ring group/avatar absolute -top-6 left-6 block rounded-full focus-visible:ring-2 focus-visible:outline-none"
          >
            {author.image?.asset?.url ? (
              <Image
                src={author.image.asset.url}
                alt={author.name ?? ""}
                width={48}
                height={48}
                className="ring-card h-12 w-12 rounded-full object-cover ring-2"
              />
            ) : (
              <span className="bg-muted ring-card flex h-12 w-12 items-center justify-center rounded-full text-xs ring-2">
                {(author.name ?? "?").slice(0, 1).toUpperCase()}
              </span>
            )}
            <span className="bg-foreground text-background pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition group-hover/avatar:opacity-100">
              {author.name}
            </span>
          </Link>
        ) : null}

        {category ? (
          categorySlug ? (
            <Link
              href={`/blog/category/${categorySlug}`}
              className="bg-muted text-muted-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring w-fit rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {category}
            </Link>
          ) : (
            <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium capitalize">
              {category}
            </span>
          )
        ) : null}

        <Link
          href={`/blog/${slug}`}
          className="focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
        >
          <h3 className="line-clamp-2 text-lg font-semibold">{title}</h3>
        </Link>

        {description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
        ) : null}

        <div className="text-muted-foreground mt-auto flex items-center justify-between gap-3 pt-3 text-xs">
          {author?.name ? <span className="truncate">{author.name}</span> : <span />}
          {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
        </div>
      </div>
    </article>
  );
}
