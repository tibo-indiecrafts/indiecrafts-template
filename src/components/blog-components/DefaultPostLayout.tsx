import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/config";
import { Link } from "@/i18n/routing";
import type { Post, PostListItem } from "@/sanity/types";
import { Toc } from "./Toc";
import { BlogCard } from "./BlogCard";
import { PostHeader } from "./PostHeader";
import { portableComponents } from "./modules/portable-text-components";

/**
 * Server-rendered post page when no module-driven layout is configured.
 * Renders a back-link, cover image, ring-card header (extracted in
 * `PostHeader`), the body, a tag chip row, the TOC sidebar, and a
 * "Keep reading" grid of related posts.
 *
 * Every visible string comes from `pages.blog.*` translations — no
 * literals here so locale propagates cleanly.
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
  const t = await getTranslations("pages.blog");
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

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-(--gutter) py-16 md:grid-cols-[1fr_220px] md:py-24">
      <article className="min-w-0">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("backToList")}
        </Link>

        {image ? (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={post.metadata?.image?.alt ?? title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        ) : null}

        <PostHeader
          author={author}
          authorHref={authorHref}
          categoryRef={post.categories?.[0]}
          title={title}
          description={description}
          date={date}
          datetime={post.publishedAt}
          readTime={readTime}
          byLabel={(name) => t("by", { name })}
          minReadLabel={(minutes) => t("minRead", { minutes })}
        />

        {post.body ? (
          <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
            <PortableText value={post.body} components={portableComponents} />
          </div>
        ) : null}

        {post.tags && post.tags.length > 0 ? (
          <div className="border-border/60 mt-10 flex flex-wrap items-center gap-2 border-t pt-6">
            <span className="text-muted-foreground text-sm">{t("tagsLabel")}:</span>
            {post.tags.map((tag) =>
              tag.slug ? (
                <Link
                  key={tag._id}
                  href={`/blog/tag/${tag.slug}`}
                  className="bg-muted text-muted-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  #{tag.title}
                </Link>
              ) : (
                <span
                  key={tag._id}
                  className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-medium"
                >
                  #{tag.title}
                </span>
              ),
            )}
          </div>
        ) : null}
      </article>

      {post.headings?.length ? (
        <aside className="md:pt-[3.5rem]">
          <Toc headings={post.headings} title={t("onThisPage")} />
        </aside>
      ) : null}

      {related.length > 0 ? (
        <section
          aria-labelledby="related-posts-title"
          className="border-border/60 mt-8 border-t pt-12 md:col-span-2 md:mt-16 md:pt-16"
        >
          <header className="flex flex-col items-center gap-3 text-center">
            <h2 id="related-posts-title" className="text-2xl font-semibold md:text-3xl">
              {t("related")}
            </h2>
            <p className="text-muted-foreground max-w-lg">{t("relatedSubheading")}</p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((p) => (
              <li key={p._id}>
                <BlogCard post={p} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
