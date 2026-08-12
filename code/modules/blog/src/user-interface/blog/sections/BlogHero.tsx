import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Link } from "@indiecrafts/i18n";
import { features, type Locale } from "@indiecrafts/config";
import { formatPostDate, parseVideoEmbed } from "@indiecrafts/utils";
import type { PostListItem } from "@indiecrafts/blog/sanity/types";

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
  const t = useTranslations("pages.blog");
  const slug = post.slug ?? "";
  const image = post.metadata?.image?.asset?.url;
  const lqip = post.metadata?.image?.asset?.metadata?.lqip;
  const alt = post.metadata?.image?.alt;
  const title = post.metadata?.title ?? post.title ?? "";
  const categoryRef = post.categories?.[0];
  const category = categoryRef?.title;
  const categorySlug = categoryRef?.slug;
  const authors = post.authors ?? [];
  const author = authors[0];
  const moreAuthors = authors.length - 1;
  const { authors: showAuthors, categories: showCategories } = features.blogTaxonomy;
  const date = formatPostDate(locale, post.publishedAt);
  const hasVideo = !!parseVideoEmbed(post.metadata?.video);

  return (
    <article
      className={`group ring-border/50 relative overflow-hidden rounded-xl ring-1 transition hover:shadow-lg ${span} ${height}`}
    >
      {image ? (
        <Image
          src={image}
          alt={alt ?? title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          placeholder={lqip ? "blur" : undefined}
          blurDataURL={lqip ?? undefined}
          className="absolute inset-0 z-0 object-cover"
          priority={size === "lg"}
        />
      ) : (
        <div className="bg-muted absolute inset-0" aria-hidden="true" />
      )}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-black/20" />

      {hasVideo ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="bg-background/85 flex size-12 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Play className="text-foreground size-5 translate-x-0.5 fill-current" />
          </span>
        </span>
      ) : null}

      {category && showCategories ? (
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
          aria-label={hasVideo ? t("playVideo") : title}
          className="focus-visible:ring-ring rounded after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
        >
          {size === "lg" ? (
            <h2 className="mb-4 line-clamp-2 text-2xl font-semibold md:text-3xl">
              {title}
            </h2>
          ) : (
            <h3 className="mb-3 line-clamp-2 text-lg font-semibold">{title}</h3>
          )}
        </Link>
        <div className="flex items-center justify-between text-xs text-white/85">
          {author?.name && showAuthors ? (
            <span className="truncate">
              {author.name}
              {moreAuthors > 0 ? ` +${moreAuthors}` : ""}
            </span>
          ) : (
            <span />
          )}
          {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
        </div>
      </div>
    </article>
  );
}
