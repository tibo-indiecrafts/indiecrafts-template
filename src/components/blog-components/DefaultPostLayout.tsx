import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import type { Post, PostListItem } from "@/sanity/types";
import { BlogCard } from "./BlogCard";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Toc } from "./Toc";
import { portableComponents } from "./modules/portable-text-components";

/**
 * Server-rendered post page when no module-driven layout is configured.
 * Editorial 2-column layout adapted from indiecrafts-library's
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
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;
  const readTime = post.readTime && post.readTime > 0 ? post.readTime : null;
  const author = post.author;
  const authorHref = author?.slug ? `/author/${author.slug}` : "/author";
  const categoryRef = post.categories?.[0];
  const tags = (post.tags ?? []).filter((tag) => tag.slug);

  const breadcrumbs: Crumb[] = [
    { label: nav("blog"), href: "/blog" },
    ...(categoryRef?.slug
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

  // Theming: when there's a cover image, the hero overlays content on the
  // image so all text + chips switch to white-on-dark. Without an image,
  // we fall back to the theme's foreground colours.
  const heroLight = !image;

  return (
    <article className="pb-16 md:pb-24">
      <div className="mx-auto max-w-(--max-container) px-(--gutter)">
        <header
          className={cn(
            "relative mb-12 flex flex-col overflow-hidden rounded-b-3xl shadow-xl md:mb-16",
            image
              ? "min-h-[60vh] ring-1 shadow-black/15 ring-black/10 md:min-h-[70vh]"
              : "bg-card ring-border/60 mt-8 rounded-3xl ring-1 shadow-black/5 md:mt-12",
          )}
        >
          {image ? (
            <>
              <Image
                src={image}
                alt={post.metadata?.image?.alt ?? title}
                width={1600}
                height={900}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="absolute inset-0 size-full object-cover"
                priority
              />
              {/* Dark gradient — heavy at the bottom for legibility, fades up. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15"
              />
            </>
          ) : null}

          {/* Breadcrumbs sit at the top of the hero, overlaid on the
              image with a subtle backdrop-blurred pill so they stay legible
              regardless of what the image looks like. */}
          <div className="relative px-6 pt-6 sm:px-10 md:px-14 lg:px-20">
            <Breadcrumbs
              items={breadcrumbs}
              label={t("breadcrumbsLabel")}
              className={cn(
                "inline-flex rounded-full px-3 py-1.5 ring-1 backdrop-blur-md",
                heroLight
                  ? "bg-background/70 ring-border/60"
                  : "bg-black/30 text-white/90 ring-white/15",
              )}
            />
          </div>

          {/* Title block — pushed to the bottom of the hero. */}
          <div className="relative mt-auto px-6 pt-16 pb-10 sm:px-10 sm:pt-20 sm:pb-14 md:px-14 md:pt-24 md:pb-16 lg:px-20 lg:pt-28 lg:pb-20">
            <div className="max-w-3xl">
              {tags.length > 0 ? (
                <ul className="mb-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag._id}>
                      <Link
                        href={`/blog/tag/${tag.slug}`}
                        className={cn(
                          "focus-visible:ring-ring rounded-md px-2 py-1 text-xs font-medium capitalize backdrop-blur transition-colors focus-visible:ring-2 focus-visible:outline-none",
                          heroLight
                            ? "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
                            : "bg-white/15 text-white hover:bg-white/25",
                        )}
                      >
                        #{tag.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              <h1
                className={cn(
                  "text-3xl font-bold tracking-tight text-balance md:text-5xl xl:text-6xl",
                  "leading-[1.05]",
                  heroLight ? "text-foreground" : "text-white drop-shadow-lg",
                )}
              >
                {title}
              </h1>
              {description ? (
                <p
                  className={cn(
                    "mt-6 text-lg leading-relaxed md:text-xl",
                    heroLight ? "text-muted-foreground" : "text-white/85",
                  )}
                >
                  {description}
                </p>
              ) : null}

              {/* Meta strip — author block + publish/read-time/category.
                  Stacks on mobile, single row from sm: upward. */}
              <div
                className={cn(
                  "mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3",
                  heroLight ? "border-border/60" : "border-white/25",
                )}
              >
                {author?.name ? (
                  <Link
                    href={authorHref}
                    aria-label={author.name}
                    className={cn(
                      "focus-visible:ring-ring group flex items-center gap-3 rounded focus-visible:ring-2 focus-visible:outline-none",
                      heroLight ? "" : "focus-visible:ring-white/80",
                    )}
                  >
                    {author.image?.asset?.url ? (
                      <Image
                        src={author.image.asset.url}
                        alt={author.name}
                        width={80}
                        height={80}
                        className={cn(
                          "bg-card size-10 rounded-full object-cover ring-1",
                          heroLight ? "ring-border" : "ring-white/40",
                        )}
                      />
                    ) : (
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full text-xs ring-1",
                          heroLight
                            ? "bg-muted ring-border"
                            : "bg-white/15 text-white ring-white/30",
                        )}
                      >
                        {author.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <span
                        className={cn(
                          "block truncate text-sm font-medium transition-colors",
                          heroLight
                            ? "text-foreground group-hover:text-muted-foreground"
                            : "text-white group-hover:text-white/80",
                        )}
                      >
                        {author.name}
                      </span>
                      {author.position ? (
                        <span
                          className={cn(
                            "block truncate text-xs",
                            heroLight ? "text-muted-foreground" : "text-white/70",
                          )}
                        >
                          {author.position}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ) : null}

                {date || readTime || categoryRef?.slug ? (
                  <dl
                    className={cn(
                      "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:ml-auto",
                      heroLight ? "text-muted-foreground" : "text-white/80",
                    )}
                  >
                    {date ? (
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">{t("metaPublished")}</dt>
                        <dd>
                          <time dateTime={post.publishedAt}>{date}</time>
                        </dd>
                      </div>
                    ) : null}
                    {readTime ? (
                      <div
                        className={cn(
                          "flex items-center gap-1.5 sm:border-l sm:pl-4",
                          heroLight ? "border-border/60" : "border-white/30",
                        )}
                      >
                        <dt className="sr-only">{t("metaReadTime")}</dt>
                        <dd>{t("minRead", { minutes: readTime })}</dd>
                      </div>
                    ) : null}
                    {categoryRef?.title && categoryRef.slug ? (
                      <div
                        className={cn(
                          "flex items-center gap-1.5 sm:border-l sm:pl-4",
                          heroLight ? "border-border/60" : "border-white/30",
                        )}
                      >
                        <dt className="sr-only">{t("metaCategory")}</dt>
                        <dd>
                          <Link
                            href={`/blog/category/${categoryRef.slug}`}
                            className={cn(
                              "capitalize transition-colors",
                              heroLight ? "hover:text-foreground" : "hover:text-white",
                            )}
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
          </div>
        </header>

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
