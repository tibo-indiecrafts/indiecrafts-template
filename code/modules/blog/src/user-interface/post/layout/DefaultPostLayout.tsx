import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import { features, type Locale } from "@indiecrafts/config";
import { cn } from "@indiecrafts/utils";
import { Link } from "@indiecrafts/i18n";
import type { Post, PostListItem } from "@indiecrafts/blog/sanity/types";
import { BlogCard } from "@indiecrafts/blog/user-interface/shared/components/BlogCard";
import { FeaturedMedia } from "@indiecrafts/ui-components/renderers/FeaturedMedia";
import {
  Breadcrumbs,
  type Crumb,
} from "@indiecrafts/blog/user-interface/shared/components/Breadcrumbs";
import { Toc } from "@indiecrafts/blog/user-interface/post/components/Toc";
import { MobileToc } from "@indiecrafts/blog/user-interface/post/components/MobileToc";
import { portableComponents } from "@indiecrafts/ui-components/renderers/portable-text-components";
import { formatPostDate } from "@indiecrafts/utils";

/**
 * Server-rendered post page when no module-driven layout is configured.
 * Editorial 2-column layout adapted from component-library's
 * `pages-customer-story/customer-story-04`:
 *
 *   - Breadcrumb trail at top
 *   - Title + lead in a max-w-2xl block above the columns
 *   - Main column: cover image → body → "About the author" quote block
 *   - Sticky right sidebar: TOC + meta (published / read time / author /
 *     category / tags)
 *   - Footer back-link
 *   - "Keep reading" related-posts grid below everything
 */
export async function DefaultPostLayout({
  post,
  locale,
  image,
  title,
  description,
  related,
}: {
  post: Post;
  locale: Locale;
  image?: string;
  title: string;
  description?: string;
  related: PostListItem[];
}) {
  const [t, nav] = await Promise.all([
    getTranslations("pages.blog"),
    getTranslations("nav"),
  ]);
  const date = formatPostDate(locale, post.publishedAt, { month: "long" });
  const readTime = post.readTime && post.readTime > 0 ? post.readTime : null;
  const authors = post.authors ?? [];
  const categoryRef = post.categories?.[0];
  const tags = (post.tags ?? []).filter((tag) => tag.slug);
  // Author / category / tag link to routes gated per-type by `features.blogTaxonomy`.
  const {
    authors: showAuthors,
    categories: showCategories,
    tags: showTags,
  } = features.blogTaxonomy;

  const breadcrumbs: Crumb[] = [
    { label: nav("blog"), href: "/blog" },
    ...(categoryRef?.slug && showCategories
      ? [
          {
            label: categoryRef.title ?? "",
            href: `/blog/category/${categoryRef.slug}`,
          },
        ]
      : []),
    { label: title },
  ];

  const hasToc = (post.headings?.length ?? 0) > 0;

  // One hero structure for image and video alike: the cover — or an
  // inline-playable video — sits in a media block, and the title + meta read
  // below in theme colours. `FeaturedMedia` swaps the poster for an inline
  // player on click, so there's no modal and no separate video block.
  const heroLqip = post.metadata?.image?.asset?.metadata?.lqip;
  const hasHeroMedia = !!image || !!post.metadata?.video;

  return (
    <article className="pb-16 md:pb-24">
      <div className="mx-auto max-w-(--max-container) px-(--gutter)">
        <header className="mt-8 mb-12 md:mt-12 md:mb-16">
          <Breadcrumbs
            items={breadcrumbs}
            label={t("breadcrumbsLabel")}
            className="text-muted-foreground mb-6 inline-flex text-sm"
          />

          {hasHeroMedia ? (
            <FeaturedMedia
              image={image}
              alt={post.metadata?.image?.alt ?? title}
              videoUrl={post.metadata?.video}
              autoplay={post.metadata?.videoAutoplay}
              controls={post.metadata?.videoControls ?? true}
              lqip={heroLqip}
              aspect="aspect-[16/9]"
              sizes="(min-width: 1280px) 1152px, 100vw"
              priority
              playLabel={t("playVideo")}
              className="ring-border/60 rounded-2xl shadow-lg ring-1"
            />
          ) : null}

          <div className={cn("max-w-3xl", hasHeroMedia && "mt-10")}>
            {tags.length > 0 && showTags ? (
              <ul className="mb-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag._id}>
                    <Link
                      href={`/blog/tag/${tag.slug}`}
                      className="bg-muted text-muted-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      #{tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            <h1 className="text-3xl leading-[1.05] font-bold tracking-tight text-balance md:text-5xl xl:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className="text-muted-foreground mt-6 text-lg leading-relaxed md:text-xl">
                {description}
              </p>
            ) : null}

            {/* Meta strip — author block + publish/read-time/category. */}
            <div className="border-border/60 mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              {authors.length > 0 && showAuthors ? (
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  {authors.map((a) => (
                    <Link
                      key={a._id ?? a.slug ?? a.name}
                      href={a.slug ? `/author/${a.slug}` : "/author"}
                      aria-label={a.name}
                      className="focus-visible:ring-ring group flex items-center gap-3 rounded focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {a.image?.asset?.url ? (
                        <Image
                          src={a.image.asset.url}
                          alt={a.name ?? ""}
                          width={80}
                          height={80}
                          className="bg-muted ring-border size-10 rounded-full object-cover ring-1"
                        />
                      ) : (
                        <span className="bg-muted text-muted-foreground ring-border flex size-10 items-center justify-center rounded-full text-xs ring-1">
                          {(a.name ?? "?").slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <span className="text-foreground group-hover:text-muted-foreground block truncate text-sm font-medium transition-colors">
                          {a.name}
                        </span>
                        {a.position ? (
                          <span className="text-muted-foreground block truncate text-xs">
                            {a.position}
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}

              {date || readTime || categoryRef?.slug ? (
                <dl className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:ml-auto">
                  {date ? (
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{t("metaPublished")}</dt>
                      <dd>
                        <time dateTime={post.publishedAt}>{date}</time>
                      </dd>
                    </div>
                  ) : null}
                  {readTime ? (
                    <div className="sm:border-border/60 flex items-center gap-1.5 sm:border-l sm:pl-4">
                      <dt className="sr-only">{t("metaReadTime")}</dt>
                      <dd>{t("minRead", { minutes: readTime })}</dd>
                    </div>
                  ) : null}
                  {categoryRef?.title && categoryRef.slug && showCategories ? (
                    <div className="sm:border-border/60 flex items-center gap-1.5 sm:border-l sm:pl-4">
                      <dt className="sr-only">{t("metaCategory")}</dt>
                      <dd>
                        <Link
                          href={`/blog/category/${categoryRef.slug}`}
                          className="hover:text-foreground capitalize transition-colors"
                        >
                          {categoryRef.title}
                        </Link>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </div>
          </div>
        </header>

        {hasToc ? <MobileToc headings={post.headings!} title={t("onThisPage")} /> : null}

        <div className="flex gap-8 lg:gap-12">
          {hasToc ? (
            <aside className="order-last hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <Toc headings={post.headings!} title={t("onThisPage")} />
              </div>
            </aside>
          ) : null}

          {/* Body panel — full available width with internal padding so the
              card visual matches the hero. Reading line stays at max-w-3xl
              left-aligned inside the panel. */}
          <div className="bg-card min-w-0 flex-1 rounded-3xl px-6 pt-4 pb-10 sm:px-10 sm:pt-6 sm:pb-14 md:px-14 md:pt-8 md:pb-16 lg:px-16 lg:pt-10 lg:pb-20">
            {post.body ? (
              <div className="prose prose-neutral dark:prose-invert max-w-3xl">
                <PortableText value={post.body} components={portableComponents} />
              </div>
            ) : null}
          </div>
        </div>

        <footer className="border-border/60 mt-12 border-t py-8">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t("backToList")}
          </Link>
        </footer>

        {related.length > 0 ? (
          <section aria-labelledby="related-posts-title" className="mt-12 pt-16">
            <header className="flex flex-col items-center gap-3 text-center">
              <h2 id="related-posts-title" className="text-2xl font-semibold md:text-3xl">
                {t("related")}
              </h2>
              <p className="text-muted-foreground max-w-lg">{t("relatedSubheading")}</p>
            </header>
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p._id}>
                  <BlogCard post={p} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
