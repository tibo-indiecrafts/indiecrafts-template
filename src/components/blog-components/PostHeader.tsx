import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Post } from "@/sanity/types";

/**
 * Header card for the default post layout — author avatar overlay,
 * clickable category badge, title, description, and a meta row with
 * author link, date, and read time. Pure presentational; the parent
 * provides the localized labels.
 */
export function PostHeader({
  author,
  authorHref,
  categoryRef,
  title,
  description,
  date,
  datetime,
  readTime,
  byLabel,
  minReadLabel,
}: {
  author: Post["author"];
  authorHref: string;
  categoryRef: NonNullable<Post["categories"]>[number] | undefined;
  title: string;
  description?: string;
  date: string | null;
  datetime?: string;
  readTime: number | null;
  byLabel: (name: string) => string;
  minReadLabel: (minutes: number) => string;
}) {
  const categorySlug = categoryRef?.slug;

  return (
    <header className="bg-card ring-border/60 relative mt-0 flex flex-col gap-4 rounded-xl p-6 shadow-sm ring-1 md:mx-6 md:-mt-8">
      {author ? (
        <Link
          href={authorHref}
          aria-label={author.name ?? undefined}
          className="focus-visible:ring-ring absolute -top-10 left-6 block rounded-full focus-visible:ring-2 focus-visible:outline-none"
        >
          {author.image?.asset?.url ? (
            <Image
              src={author.image.asset.url}
              alt={author.name ?? ""}
              width={80}
              height={80}
              className="ring-card h-20 w-20 rounded-full object-cover ring-4"
            />
          ) : (
            <span className="bg-muted ring-card flex h-20 w-20 items-center justify-center rounded-full text-xl ring-4">
              {(author.name ?? "?").slice(0, 1).toUpperCase()}
            </span>
          )}
        </Link>
      ) : null}
      <div className={author ? "pt-10" : ""}>
        {categoryRef?.title ? (
          categorySlug ? (
            <Link
              href={`/blog/category/${categorySlug}`}
              className="bg-muted text-muted-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring w-fit rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {categoryRef.title}
            </Link>
          ) : (
            <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium">
              {categoryRef.title}
            </span>
          )
        ) : null}
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-3 text-balance">{description}</p>
        ) : null}
      </div>
      <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
        {author?.name ? (
          <Link
            href={authorHref}
            className="hover:text-foreground focus-visible:ring-ring rounded focus-visible:ring-2 focus-visible:outline-none"
          >
            {byLabel(author.name)}
          </Link>
        ) : null}
        {author?.name && date ? <span aria-hidden="true">·</span> : null}
        {date ? <time dateTime={datetime}>{date}</time> : null}
        {readTime ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{minReadLabel(readTime)}</span>
          </>
        ) : null}
      </div>
    </header>
  );
}
