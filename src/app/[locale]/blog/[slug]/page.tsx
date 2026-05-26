import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { features, isPageVisible, pages, site, type Locale } from "@/config";
import { Link } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildArticleSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/app/_chrome/DefaultLayout";
import { sanityFetchLive } from "@/sanity/live";
import { allPostSlugsQuery, postBySlugQuery } from "@/sanity/queries";
import type { Post, PostSlug } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog) return [];
  const slugs = await sanityFetchLive<PostSlug[]>({ query: allPostSlugsQuery });
  return slugs.flatMap((row) =>
    row.slug
      ? [
          { locale: "en", slug: row.slug },
          { locale: "fr", slug: row.slug },
        ]
      : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const post = await sanityFetchLive<Post | null>({
    query: postBySlugQuery,
    params: { slug },
  });
  const base = await buildMetadata({ page: pages.blog, locale });
  if (!post) return base;

  // Per-post SEO overrides come from the `metadata` object — falls back
  // to the post's title when the metadata title is blank.
  const title = post.metadata?.title ?? post.title;
  const description = post.metadata?.description;
  const ogImage = post.metadata?.image?.asset?.url;

  return {
    ...base,
    title,
    description,
    robots: post.metadata?.noIndex ? { index: false, follow: false } : base.robots,
    openGraph: {
      ...base.openGraph,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : base.openGraph?.images,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.blog)) notFound();
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await sanityFetchLive<Post | null>({
    query: postBySlugQuery,
    params: { slug },
  });
  if (!post) notFound();

  const t = await getTranslations("pages.blog");
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description;
  const image = post.metadata?.image?.asset?.url;

  return (
    <DefaultLayout>
      <PageSchemas
        page={{
          ...pages.blog,
          seo: {
            ...pages.blog.seo,
            structuredData: [
              buildArticleSchema({
                headline: title,
                description,
                datePublished: post.publishedAt ?? new Date().toISOString(),
                authorName: post.author?.name,
                image,
                url: `${site.url}/${locale}/blog/${slug}`,
              }),
            ],
          },
        }}
        locale={locale}
      />

      <article className="mx-auto max-w-3xl px-(--gutter) py-16 md:py-24">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("backToList")}
        </Link>

        <header className="mt-8 flex flex-col gap-4">
          {post.categories?.[0]?.title ? (
            <span className="bg-muted text-muted-foreground w-fit rounded-md px-2 py-1 text-xs font-medium">
              {post.categories[0].title}
            </span>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {description ? (
            <p className="text-muted-foreground text-balance">{description}</p>
          ) : null}
          <div className="text-muted-foreground flex items-center gap-3 text-sm">
            {post.author?.name ? (
              <span>{t("by", { name: post.author.name })}</span>
            ) : null}
            {post.author?.name && date ? <span>·</span> : null}
            {date ? <time dateTime={post.publishedAt}>{date}</time> : null}
          </div>
        </header>

        {image ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl">
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

        {post.body ? (
          <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
            <PortableText value={post.body} components={portableComponents} />
          </div>
        ) : null}
      </article>
    </DefaultLayout>
  );
}

/**
 * PortableText render map — keeps the output prose-flavored without
 * needing any extra plugins. Adds a `link` annotation that opens external
 * URLs in a new tab.
 */
const portableComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
  },
};
