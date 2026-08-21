import { getTranslations } from "next-intl/server";
import { Link } from "@indiecrafts/packages-web-i18n";
import { type Locale } from "@indiecrafts/packages-shared-config";
import { formatDate } from "@indiecrafts/packages-shared-utils/format-date";
import type { PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { FeaturedMedia } from "@indiecrafts/packages-web-ui-components/web/media/FeaturedMedia";

/**
 * Post card used by the blog listing, category explorer, and author detail.
 * One quiet structure: featured media (image or inline-playable video), a
 * category chip, the title, a short excerpt, and an author · date footer.
 * The title link is stretched over the whole card, so a click anywhere that
 * isn't the play button or a raised link opens the post.
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
  const image = post.metadata?.image?.asset?.url;
  const lqip = post.metadata?.image?.asset?.metadata?.lqip;
  const alt = post.metadata?.image?.alt;
  const categoryRef = post.categories?.[0];
  const category = categoryRef?.title;
  const categorySlug = categoryRef?.slug;
  const date = formatDate(locale, post.publishedAt);
  const slug = post.slug ?? "";
  const title = post.metadata?.title ?? post.title ?? "";
  // Prefer the editorial excerpt; fall back to the SEO description.
  const authors = post.authors ?? [];
  const author = authors[0];
  const moreAuthors = authors.length - 1;
  // Author / category chips + excerpt follow the editor's display toggles
  // (which already fold in `features.blogTaxonomy`).
  const display = await getBlogSettings();
  const { authors: showAuthors, categories: showCategories } = display.taxonomy;
  const description = display.cards.excerpt
    ? (post.excerpt ?? post.metadata?.description)
    : undefined;
  const t = await getTranslations({ locale, namespace: "pages.blog" });

  return (
    <article className="bg-card ring-border/60 group relative flex h-full flex-col overflow-hidden rounded-xl shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <FeaturedMedia
        image={image}
        alt={alt ?? title}
        videoUrl={post.metadata?.video}
        lqip={lqip}
        aspect={variant === "wide" ? "aspect-[16/9]" : "aspect-[4/3]"}
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        playLabel={t("playVideo")}
      />

      <div className="flex flex-1 flex-col gap-3 p-6">
        {category && showCategories ? (
          categorySlug ? (
            <Link
              href={`/blog/category/${categorySlug}`}
              className="bg-muted text-muted-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring relative z-10 w-fit rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {category}
            </Link>
          ) : (
            <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium capitalize">
              {category}
            </span>
          )
        ) : null}

        <h3 className="text-lg font-semibold">
          <Link
            href={`/blog/${slug}`}
            className="group-hover:text-brand focus-visible:ring-ring rounded transition-colors after:absolute after:inset-0 focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="line-clamp-2">{title}</span>
          </Link>
        </h3>

        {description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {description}
          </p>
        ) : null}

        <div className="text-muted-foreground mt-auto flex items-center justify-between gap-3 pt-2 text-xs">
          {author?.name && showAuthors ? (
            <span className="relative z-10 flex min-w-0 max-w-[70%] items-center gap-1">
              <Link
                href={author.slug ? `/author/${author.slug}` : "/author"}
                className="hover:text-foreground focus-visible:ring-ring truncate rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                {author.name}
              </Link>
              {moreAuthors > 0 ? (
                <span className="shrink-0">+{moreAuthors}</span>
              ) : null}
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
